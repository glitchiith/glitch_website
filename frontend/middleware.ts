import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Authentication is enforced by Firebase and the Go API. Never gate static WebGL
// assets on a one-hour navigation cookie: long games must keep loading.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}
export const config = { matcher: ["/", "/leaderboard", "/login"] };
