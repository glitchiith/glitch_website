// /api/get-uid



import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseadmin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Firebase token" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    return NextResponse.json({ uid });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get UID" },
      { status: 500 }
    );
  }
}
