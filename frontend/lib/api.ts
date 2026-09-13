import { auth } from "./firebase";
import { setCookie } from "cookies-next";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (!base) throw new Error("The backend address is not configured.");
  return fetch(base + path, {
    ...options,
    cache: "no-store",
    signal: options.signal ?? AbortSignal.timeout(20000),
  });
}
export async function apiJSON<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (authenticated) {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) throw new ApiError("Please sign in before continuing.", 401);
    const token = await user.getIdToken();
    headers.set("Authorization", "Bearer " + token);
    // Keep navigation cookies current; the backend verifies the bearer token.
    setCookie("authToken", token, {
      path: "/",
      maxAge: 3600,
      sameSite: "lax",
      secure: location.protocol === "https:",
    });
    setCookie("uid", user.uid, {
      path: "/",
      maxAge: 3600,
      sameSite: "lax",
      secure: location.protocol === "https:",
    });
  }
  let response: Response;
  try {
    response = await apiFetch(path, { ...options, headers });
  } catch {
    throw new Error(
      "Cannot reach the server. Check your connection and retry.",
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      body.error || "Request failed. Please retry.",
      response.status,
    );
  return body as T;
}
