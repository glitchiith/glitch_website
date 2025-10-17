import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple in-memory cache for user stats per game
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds cache

export async function GET(
  request: NextRequest,
  { params }: { params: { game_id: string } }
) {
  try {
    const uid = request.cookies.get("uid")?.value;
    const gameId = parseInt(params.game_id, 10);

    // ✅ Validate gameId
    if (isNaN(gameId) || gameId < 1 || gameId > 5) {
      return NextResponse.json(
        { error: "Invalid game_id. Must be between 1 and 5." },
        { status: 400 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { error: "Not authenticated. UID not found." },
        { status: 401 }
      );
    }

    // ✅ Cache key unique per user and game
    const cacheKey = `user_stats_${uid}_game_${gameId}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // ✅ Fetch user data
    const user = await prisma.user.findUnique({
      where: { uid },
      select: {
        uid: true,
        name: true,
        hostel_id: true,
        [`bestScore${gameId}`]: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const scoreField = `bestScore${gameId}` as const;
    const userScore = user[scoreField] ?? 0;

    // ✅ Fetch hostel name
    let hostelName = "Unknown";
    if (user.hostel_id) {
      const hostel = await prisma.hostels.findUnique({
        where: { id: user.hostel_id },
        select: { name: true },
      });
      hostelName = hostel?.name || "Unknown";
    }

    // ✅ Compute rank for this game
    const higherScoreCount = await prisma.user.count({
      where: {
        [scoreField]: { gt: userScore },
        hostel_id: { not: null },
      },
    });

    const rank = higherScoreCount + 1;
    const inTop20 = rank <= 20;

    // ✅ Build response for this single game
    const response = {
      uid: user.uid,
      name: user.name || "Anonymous",
      hostel_id: user.hostel_id,
      hostel_name: hostelName,
      game: {
        game_id: gameId,
        score: userScore,
        rank,
        in_top_20: inTop20,
      },
      timestamp: new Date().toISOString(),
    };

    // ✅ Cache it
    cache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
