"use client";
import { useCallback, useEffect, useState } from "react";
import { apiJSON } from "@/lib/api";

type Player = {
  rank: number;
  name: string;
  hostel_name: string;
  score: number;
};
type Hostel = {
  rank: number;
  hostel_id: number;
  hostel_name: string;
  total_score: number;
  participant_count: number;
};
export default function LeaderboardPage() {
  const [tab, setTab] = useState<"players" | "hostels">("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setError("");
    try {
      const [p, h] = await Promise.all([
        apiJSON<{ players: Player[] }>("/api/leaderboard/players"),
        apiJSON<{ leaderboard: Hostel[] }>("/api/leaderboard/hostels"),
      ]);
      setPlayers(p.players);
      setHostels(h.leaderboard);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leaderboards.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const update = () => {
      if (!document.hidden) void refresh();
    };
    const storage = (e: StorageEvent) => {
      if (e.key === "scores-updated") update();
    };
    window.addEventListener("scores-updated", update);
    window.addEventListener("storage", storage);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener("scores-updated", update);
      window.removeEventListener("storage", storage);
      window.removeEventListener("focus", update);
    };
  }, [refresh]);
  return (
    <main className="mx-auto min-h-[75vh] max-w-5xl px-4 py-12 text-white">
      <h1 className="text-center text-4xl font-bold text-green-400 md:text-6xl">
        LEADERBOARD
      </h1>
      <p className="my-4 text-center text-gray-300">
        One game. Your best run. Your hostel.
      </p>
      <div
        className="my-8 flex flex-wrap justify-center gap-3"
        role="tablist"
        aria-label="Leaderboard views"
      >
        <button
          role="tab"
          aria-selected={tab === "players"}
          onClick={() => setTab("players")}
          className={
            "rounded-lg px-5 py-3 font-bold " +
            (tab === "players" ? "bg-green-700" : "bg-gray-800")
          }
        >
          Top 20 Players
        </button>
        <button
          role="tab"
          aria-selected={tab === "hostels"}
          onClick={() => setTab("hostels")}
          className={
            "rounded-lg px-5 py-3 font-bold " +
            (tab === "hostels" ? "bg-green-700" : "bg-gray-800")
          }
        >
          Hostel Standings
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded border border-red-700 p-4 text-red-300"
        >
          {error}{" "}
          <button onClick={refresh} className="underline">
            Retry
          </button>
        </p>
      )}
      <div
        role="tabpanel"
        className="overflow-x-auto rounded-xl border border-green-900 bg-gray-950"
      >
        {loading ? (
          <p role="status" className="p-8 text-center">
            Loading leaderboard…
          </p>
        ) : tab === "players" ? (
          players.length === 0 ? (
            <p className="p-8 text-center text-gray-300">
              No scores yet. Submit your first run to join the leaderboard.
            </p>
          ) : (
            <table className="w-full text-left">
              <caption className="sr-only">
                Top 20 individual players across all hostels
              </caption>
              <thead className="bg-green-950">
                <tr>
                  {["Rank", "Name", "Hostel", "Best score"].map((h) => (
                    <th key={h} className="p-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.rank} className="border-t border-gray-800">
                    <td className="p-4 text-green-400">#{p.rank}</td>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4 text-gray-300">{p.hostel_name}</td>
                    <td className="p-4 font-bold">
                      {p.score.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <table className="w-full text-left">
            <caption className="sr-only">
              Hostel team rankings using each team&apos;s top 50 personal bests
            </caption>
            <thead className="bg-green-950">
              <tr>
                {["Rank", "Hostel", "Players counted", "Total score"].map(
                  (h) => (
                    <th key={h} className="p-4">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {hostels.map((h) => (
                <tr key={h.hostel_id} className="border-t border-gray-800">
                  <td className="p-4 text-green-400">#{h.rank}</td>
                  <td className="p-4 font-semibold">{h.hostel_name}</td>
                  <td className="p-4">{h.participant_count} / 50</td>
                  <td className="p-4 font-bold">
                    {h.total_score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-5 text-sm text-gray-400">
        {tab === "players"
          ? "Each player appears once. Equal scores are ordered by when the server first accepted that best score. There are no hostel quotas."
          : "Each participating hostel team totals its top 50 players’ personal bests, or everyone if fewer than 50 have submitted. Paired hostels share the same 50-player cap. Equal totals share a rank."}
      </p>
      <button className="mt-4 text-green-400 underline" onClick={refresh}>
        Refresh scores
      </button>
    </main>
  );
}
