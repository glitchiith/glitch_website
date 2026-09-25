"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiJSON } from "@/lib/api";

type Profile = {
  uid: string;
  name: string;
  hostel_id: number | null;
  best_score: number | null;
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function CompetitionEntry() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hostels, setHostels] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState("");
  const [hostelConfirmed, setHostelConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");

  const loadCompetitionData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [loadedProfile, hostelResponse] = await Promise.all([
        apiJSON<Profile>("/api/register-user", { method: "POST" }, true),
        apiJSON<{ hostels: Record<string, string> }>("/api/hostels"),
      ]);
      setProfile(loadedProfile);
      setHostels(hostelResponse.hostels);
    } catch (error) {
      setError(errorMessage(error, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        setSignedIn(!!user);
        if (user) {
          void loadCompetitionData();
        } else {
          setProfile(null);
          setLoading(false);
        }
      }),
    [loadCompetitionData],
  );

  async function saveHostel() {
    if (!selected || !hostelConfirmed) return;
    setSaving(true);
    setError("");
    try {
      setProfile(
        await apiJSON<Profile>(
          "/api/profile/hostel",
          {
            method: "PUT",
            body: JSON.stringify({ hostel_id: Number(selected) }),
          },
          true,
        ),
      );
    } catch (error) {
      setError(errorMessage(error, "Could not save hostel."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="p-8 text-center" role="status">
        Loading your player profile…
      </p>
    );
  }
  if (!signedIn) {
    return (
      <div className="p-8 text-center">
        <Link href="/login" className="text-green-400 underline">
          Sign in to play and submit scores
        </Link>
      </div>
    );
  }
  if (!profile || profile.hostel_id === null) {
    return (
      <section className="mx-auto my-8 max-w-lg rounded-xl border border-green-800 bg-gray-950 p-6 text-white">
        <h2 className="text-2xl font-bold">Choose your hostel</h2>
        <p className="my-3 text-gray-300">
          Your choice is permanent for this competition. Check it carefully
          before confirming.
        </p>
        {profile && (
          <>
            <label htmlFor="hostel" className="block mb-2">
              Hostel
            </label>
            <select
              id="hostel"
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setHostelConfirmed(false);
              }}
              className="w-full rounded bg-gray-800 p-3"
            >
              <option value="">Select your hostel</option>
              {Object.entries(hostels).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
            <label className="my-4 flex items-start gap-3">
              <input
                type="checkbox"
                checked={hostelConfirmed}
                onChange={(e) => setHostelConfirmed(e.target.checked)}
                className="mt-1"
              />
              I confirm this is my hostel and understand I cannot change it.
            </label>
            <button
              type="button"
              onClick={() => void saveHostel()}
              disabled={!selected || !hostelConfirmed || saving}
              className="rounded bg-green-600 px-5 py-3 font-bold disabled:opacity-40"
            >
              {saving ? "Saving…" : "Confirm hostel"}
            </button>
          </>
        )}
        {error && (
          <p role="alert" className="mt-4 text-red-300">
            {error}
          </p>
        )}
        {!profile && (
          <button
            type="button"
            className="mt-4 underline"
            onClick={() => void loadCompetitionData()}
          >
            Retry loading profile
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 text-white">
      <div className="mb-4 flex flex-wrap justify-between gap-2">
        <p>
          {profile.name} · {hostels[String(profile.hostel_id)]}
        </p>
        <Link href="/leaderboard" className="text-green-400 underline">
          View leaderboards
        </Link>
      </div>
      <div className="rounded-xl border border-green-900 bg-gray-950 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-green-400">Game coming soon</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-300">
          We&apos;re getting the game ready. Check back soon.
        </p>
      </div>
    </section>
  );
}
