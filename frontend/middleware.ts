import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const guest = req.cookies.get("guestMode")?.value; // ✅ Add this line


    const { pathname } = req.nextUrl;
  // Allow access to the login page always
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }
    // ✅ Allow leaderboard API calls *without* token
  if (pathname.startsWith("/api/leaderboard")) {
    return NextResponse.next();
  }

  // ✅ For other API routes
  if (pathname.startsWith("/api")) {
    // If no Authorization header, but cookie exists → attach Bearer token
    const requestHeaders = new Headers(req.headers);
    if (!requestHeaders.has("authorization") && token) {
      requestHeaders.set("authorization", `Bearer ${token}`);
    }

    // Forward the modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }



  // ✅ Allow both logged-in users and guests
  if (token || guest === "true") {
    return NextResponse.next();
  }

  // ❌ Otherwise redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
