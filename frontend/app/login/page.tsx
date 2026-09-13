"use client";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { apiJSON } from "@/lib/api";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login() {
    setBusy(true);
    setError("");
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      if (
        !user.email?.toLowerCase().endsWith("@iith.ac.in") ||
        !user.emailVerified
      ) {
        await auth.signOut();
        throw new Error(
          "Please use your verified IIT Hyderabad Google account.",
        );
      }
      await apiJSON("/api/register-user", { method: "POST" }, true);
      setCookie("guestMode", "false", {
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
      });
      window.location.href = "/";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-green-700 bg-gray-950 p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome to Glitch</h1>
        <p className="my-4 text-gray-300">
          Sign in to play and put your personal best on the leaderboard.
        </p>
        <button
          disabled={busy}
          onClick={login}
          className="w-full rounded bg-green-600 p-3 font-bold disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in with Google"}
        </button>
        <button
          disabled={busy}
          onClick={() => {
            setCookie("guestMode", "true", { path: "/", maxAge: 86400 });
            window.location.href = "/leaderboard";
          }}
          className="mt-3 w-full rounded border border-green-700 p-3"
        >
          View leaderboards as a guest
        </button>
        {error && (
          <p role="alert" className="mt-4 text-red-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
