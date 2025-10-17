  // /api/get-scores
  




import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET( request: NextRequest) {
  try {
    // Fetch all users' scores in one go
    const users = await prisma.user.findMany({
      select: {
        uid: true,
        name: true,
        hostel_id: true,
        bestScore1: true,
        bestScore2: true,
        bestScore3: true,
        bestScore4: true,
        bestScore5: true,
      },
    });
    const formattedUsers = users.map(u => ({
      ...u,
      totalScore:
        u.bestScore1 +
        u.bestScore2 +
        u.bestScore3 +
        u.bestScore4 +
        u.bestScore5,
    }));

    return NextResponse.json({ success: true , scores: formattedUsers});
  } catch (error: any) {
    console.error("❌ Error fetching user scores:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user scores", error: error.message },
      { status: 500 }
    );
  }
}
