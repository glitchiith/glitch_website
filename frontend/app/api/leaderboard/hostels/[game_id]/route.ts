// app/api/leaderboard/hostels/[game_id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

// Simple rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // 100 requests per minute per IP
const RATE_WINDOW = 60000; // 1 minute

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

    const gameId = parseInt(await params.game_id);

    // Validate game_id
    if (isNaN(gameId) || gameId < 1 || gameId > 5) {
      return NextResponse.json(
        { error: 'Invalid game_id. Must be between 1 and 5.' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `hostel_game_${gameId}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Fetch all hostels
    const hostels = await prisma.hostels.findMany({
      select: { id: true, name: true }
    });

    // Calculate scores for each hostel
    const scoreField = `bestScore${gameId}` as keyof typeof prisma.user.fields;
    
    const leaderboard = await Promise.all(
      hostels.map(async (hostel) => {
        // Sum all scores from users belonging to this hostel
        const result = await prisma.user.aggregate({
          where: { hostel_id: hostel.id },
          _sum: { [scoreField]: true }
        });

        return {
          hostel_id: hostel.id,
          hostel_name: hostel.name,
          total_score: result._sum[scoreField] || 0
        };
      })
    );

    // Sort by score in descending order
    leaderboard.sort((a, b) => b.total_score - a.total_score);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

    const response = {
      game_id: gameId,
      game_name: `Game ${gameId}`,
      leaderboard: rankedLeaderboard,
      total_hostels: rankedLeaderboard.length,
      timestamp: new Date().toISOString()
    };

    // Cache the response
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching hostel game leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}