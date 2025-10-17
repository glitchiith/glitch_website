// app/api/leaderboard/players/[game_id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { game_id: string } }
) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const gameId = parseInt(params.game_id);

    // Validate game_id
    if (isNaN(gameId) || gameId < 1 || gameId > 5) {
      return NextResponse.json(
        { error: 'Invalid game_id. Must be between 1 and 5.' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `player_game_${gameId}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Determine the score field to query
    const scoreField = `bestScore${gameId}` as 'bestScore1' | 'bestScore2' | 'bestScore3' | 'bestScore4' | 'bestScore5';

    // Fetch top 20 players for this game
    const topPlayers = await prisma.user.findMany({
      where: {
        [scoreField]: { gt: 0 }, // Only players with score > 0
        hostel_id: { not: null } // Must have a hostel
      },
      select: {
        id: true,
        uid: true,
        name: true,
        hostel_id: true,
        [scoreField]: true
      },
      orderBy: {
        [scoreField]: 'desc'
      },
      take: 20
    });

    // Fetch hostel names for all players
    const hostelIds = [...new Set(topPlayers.map(p => p.hostel_id).filter(Boolean))];
    const hostels = await prisma.hostels.findMany({
      where: { id: { in: hostelIds as number[] } },
      select: { id: true, name: true }
    });

    const hostelMap = new Map(hostels.map(h => [h.id, h.name]));

    // Format the leaderboard
    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      user_id: String(player.id),
      uid: player.uid,
      name: player.name || 'Anonymous',
      hostel_id: player.hostel_id,
      hostel_name: player.hostel_id ? hostelMap.get(player.hostel_id) || 'Unknown' : 'Unknown',
      score: player[scoreField]
    }));

    const response = {
      game_id: gameId,
      game_name: `Game ${gameId}`,
      leaderboard,
      total_players: leaderboard.length,
      timestamp: new Date().toISOString()
    };

    // Cache the response
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching player leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}