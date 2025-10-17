"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
interface HostelScore {
  rank: number;
  hostel_id: number;
  hostel_name: string;
  total_score: number;
  score_percentage?: number;
  participant_count?: number;
}

const LeaderboardPage = () => {
  const [overallData, setOverallData] = useState<HostelScore[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch overall leaderboard
  const fetchOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/leaderboard/hostels");
      const data = await res.json();
      setOverallData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOverallLeaderboard();
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-yellow-400";
    if (rank === 2) return "from-gray-400 to-gray-300";
    if (rank === 3) return "from-orange-500 to-orange-400";
    return "from-green-700 to-green-500";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050A0A] to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text">🎮 LEADERBOARD 🎮</h1>
        <p className="text-xl text-[var(--primary)]">Inter-Hostel Gaming Championship</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[var(--primary)]">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="space-y-4 px-2 md:px-0 max-w-4xl mx-auto">
          {overallData.map((hostel) => (
            <div
              key={hostel.hostel_id}
              className="bg-gray-900/60 rounded-lg p-4 border border-gray-800 hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div className="flex items-center gap-4 mb-2 md:mb-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getRankColor(
                      hostel.rank
                    )}`}
                  >
                    {getRankIcon(hostel.rank)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{hostel.hostel_name}</h3>
                    <p className="text-sm text-gray-400">{hostel.participant_count} participants</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[var(--primary)]">{hostel.total_score.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total Score</p>
                </div>
              </div>
              <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`bar-fill absolute h-full bg-gradient-to-r ${getRankColor(
                    hostel.rank
                  )} transition-all duration-1000 ease-out`}
                  style={{ width: `${hostel.score_percentage ?? 0}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
                  {hostel.score_percentage?.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        :root {
          --primary: oklch(0.85 0.35 135);
        }

        .neon-text {
          text-shadow: 0 0 8px var(--primary), 0 0 16px var(--primary),
            0 0 30px var(--primary), 0 0 45px var(--primary);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            text-shadow: 0 0 8px var(--primary), 0 0 16px var(--primary),
              0 0 30px var(--primary);
          }
          50% {
            opacity: 0.9;
            text-shadow: 0 0 12px var(--primary), 0 0 24px var(--primary),
              0 0 36px var(--primary);
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
