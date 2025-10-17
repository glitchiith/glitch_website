// app/api/leaderboard/hostels/route.ts
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

export async function GET(request: NextRequest) {
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

    // Check cache
    const cacheKey = 'overall_hostel_leaderboard';
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Fetch all hostels
    const hostels = await prisma.hostels.findMany({
      select: { id: true, name: true }
    });

    // Calculate overall scores for each hostel
    const leaderboard = await Promise.all(
      hostels.map(async (hostel) => {
        // Get all users from this hostel
        const users = await prisma.user.findMany({
          where: { hostel_id: hostel.id },
          select: {
            bestScore1: true,
            bestScore2: true,
            bestScore3: true,
            bestScore4: true,
            bestScore5: true
          }
        });

        // Calculate sum for each game
        const game1Score = users.reduce((sum, user) => sum + user.bestScore1, 0);
        const game2Score = users.reduce((sum, user) => sum + user.bestScore2, 0);
        const game3Score = users.reduce((sum, user) => sum + user.bestScore3, 0);
        const game4Score = users.reduce((sum, user) => sum + user.bestScore4, 0);
        const game5Score = users.reduce((sum, user) => sum + user.bestScore5, 0);

        // Equal weight - simple sum of all games
        const totalScore = game1Score + game2Score + game3Score + game4Score + game5Score;

        return {
          hostel_id: hostel.id,
          hostel_name: hostel.name,
          game_scores: {
            game1: game1Score,
            game2: game2Score,
            game3: game3Score,
            game4: game4Score,
            game5: game5Score
          },
          total_score: totalScore,
          participant_count: users.length
        };
      })
    );

    // Sort by total score in descending order
    leaderboard.sort((a, b) => b.total_score - a.total_score);

    // Add rank and calculate percentage from top score
    const topScore = leaderboard[0]?.total_score || 1;
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
      score_percentage: topScore > 0 ? (entry.total_score / topScore) * 100 : 0
    }));

    const response = {
      leaderboard: rankedLeaderboard,
      total_hostels: rankedLeaderboard.length,
      total_participants: rankedLeaderboard.reduce((sum, h) => sum + h.participant_count, 0),
      timestamp: new Date().toISOString()
    };

    // Cache the response
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching overall hostel leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}