"use client";

import { Games_Forward } from "@/lib/constants/games";
import React, { useState, useEffect, useRef } from "react";
import { Trophy, Medal, Zap, Users, Crown, Star } from "lucide-react";
import { getCookie } from "cookies-next";

interface HostelScore {
  rank: number;
  hostel_id: number;
  hostel_name: string;
  total_score: number;
  score_percentage?: number;
  participant_count?: number;
}

interface Player {
  rank: number;
  uid?: string;
  name: string;
  hostel_name: string;
  score: number;
}

interface UserGameStats {
  game_id: number;
  game_name: string;
  score: number;
  rank: number;
  in_top_20: boolean;
}

interface UserStats {
  uid: string;
  name: string;
  hostel_id: number | null;
  hostel_name: string;
  game: UserGameStats;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<"overall" | "games" | "players">("overall");
  const [selectedGame, setSelectedGame] = useState(1);
  const [overallData, setOverallData] = useState<HostelScore[]>([]);
  const [gameData, setGameData] = useState<HostelScore[]>([]);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const token = getCookie("authToken");
    const uid = getCookie("uid");
    setIsAuthenticated(!!token && !!uid);
  }, []);

  // Fetch user stats when authenticated
  const fetchUserStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await fetch("/api/user/stats"+`/${selectedGame}`);
      if (res.ok) {
        const data = await res.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchOverallLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard/hostels");
      const data = await res.json();
      setOverallData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
    }
    setLoading(false);
  };

  const fetchGameLeaderboard = async (gameId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/hostels/${gameId}`);
      const data = await res.json();
      setGameData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching game leaderboard:", error);
    }
    setLoading(false);
  };

  const fetchPlayerLeaderboard = async (gameId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/players/${gameId}`);
      const data = await res.json();
      setPlayerData(data.leaderboard || []);
      
      // Fetch user stats when players tab is active
      if (isAuthenticated) {
        await fetchUserStats();
      }
    } catch (error) {
      console.error("Error fetching player leaderboard:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "overall") fetchOverallLeaderboard();
    else if (activeTab === "games") fetchGameLeaderboard(selectedGame);
    else if (activeTab === "players") fetchPlayerLeaderboard(selectedGame);
  }, [activeTab, selectedGame]);

  useEffect(() => {
    if (barsRef.current && overallData.length > 0 && activeTab === "overall") {
      const bars = barsRef.current.querySelectorAll(".bar-fill");
      bars.forEach((bar, index) => {
        setTimeout(() => {
          (bar as HTMLElement).style.width =
            (bar as HTMLElement).dataset.width || "0%";
        }, index * 50);
      });
    }
  }, [overallData, activeTab]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-green-800 to-green-700";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <Trophy className="w-5 h-5 text-[var(--primary)]" />;
  };

  // Check if current user is in top 20 for selected game
  const isUserInTop20 = () => {
    if (!userStats || !isAuthenticated) return false;;
    return userStats.game?.in_top_20 || false;
  };

 
  // Render user stats card
  const renderUserStatsCard = (isInList: boolean = false) => {
    const gameStats = userStats?.game;
    if (!gameStats) return null;

    return (
      <div
        className={`relative bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-amber-900/30 backdrop-blur-sm rounded-lg p-4 border-2 ${
          isInList ? 'border-yellow-500' : 'border-amber-500'
        } transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 user-stats-card`}
      >
        {/* Special glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 rounded-lg animate-pulse-slow"></div>
        
        {/* Your Position Badge */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg animate-bounce-slow">
          <Star className="w-3 h-3 fill-current" />
          YOUR POSITION
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(gameStats.rank)} flex items-center justify-center font-bold shadow-lg shadow-yellow-500/50`}>
              {gameStats.rank}
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
                {userStats.name}
                <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full border border-yellow-500/50">YOU</span>
              </h3>
              <p className="text-sm text-gray-300">{userStats.hostel_name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-400 glow-text">
              {gameStats.score.toLocaleString()}
            </p>
            {gameStats.in_top_20 && (
              <p className="text-xs text-yellow-300 font-semibold mt-1 flex items-center justify-end gap-1">
                <Trophy className="w-3 h-3" />
                TOP 20
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050A0A] to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text">
            <span className="hidden sm:inline">🎮 </span>
            LEADERBOARD
            <span className="hidden sm:inline"> 🎮</span>
          </h1>
          <p className="text-xl text-[var(--primary)]">
            Inter-Hostel Gaming Championship
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            {
              tab: "overall",
              icon: <Users className="inline w-5 h-5 mr-2" />,
              label: "Overall Hostels",
            },
            {
              tab: "games",
              icon: <Zap className="inline w-5 h-5 mr-2" />,
              label: "Game Hostels",
            },
            {
              tab: "players",
              icon: <Trophy className="inline w-5 h-5 mr-2" />,
              label: "Top Players",
            },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-green-900 to-green-800 shadow-lg shadow-[var(--primary)]/70 scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Game Selector */}
        {(activeTab === "games" || activeTab === "players") && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((gameNum) => (
              <button
                key={gameNum}
                onClick={() => setSelectedGame(gameNum)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedGame === gameNum
                    ? "bg-gradient-to-r from-green-900 to-green-800 shadow-md shadow-[var(--primary)]/60"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
            {Games_Forward[gameNum as keyof typeof Games_Forward].game_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--primary)]">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Overall Hostels */}
            {activeTab === "overall" && (
              <div ref={barsRef} className="space-y-4 px-2 md:px-0">
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
                          <h3 className="text-xl font-bold">
                            {hostel.hostel_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {hostel.participant_count} participants
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[var(--primary)]">
                          {hostel.total_score.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">Total Score</p>
                      </div>
                    </div>
                    <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`bar-fill absolute h-full bg-gradient-to-r ${getRankColor(
                          hostel.rank
                        )} transition-all duration-1000 ease-out shadow-[0_0_10px_var(--primary)]`}
                        data-width={`${hostel.score_percentage}%`}
                        style={{ width: "0%" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
                        {hostel.score_percentage?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Game Hostels */}
            {activeTab === "games" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 md:px-0 max-h-[600px] overflow-y-auto custom-scrollbar">
                {gameData.map((item: any) => (
                  <div
                    key={item.hostel_id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-[var(--primary)] transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(
                          item.rank
                        )} flex items-center justify-center font-bold`}
                      >
                        {item.rank}
                      </div>
                      <h3 className="text-lg font-bold">{item.hostel_name}</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                      {item.total_score.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Top Players */}
            {activeTab === "players" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 md:px-0 max-h-[600px] overflow-y-auto custom-scrollbar">
                {playerData.map((item: any) => {
                  // Check if this is the current user
                  const isCurrentUser = isAuthenticated && userStats && item.uid === userStats.uid;
                  
                  if (isCurrentUser) {
                    return (
                      <div key={item.rank} className="sm:col-span-2">
                        {renderUserStatsCard(true)}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.rank}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-green-400 transition-all duration-300 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(
                            item.rank
                          )} flex items-center justify-center font-bold`}
                        >
                          {item.rank}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-400">{item.hostel_name}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-400">
                        {item.score.toLocaleString()}
                      </p>
                    </div>
                  );
                })}

                {/* Show user stats at bottom if not in top 20 */}
                {isAuthenticated && userStats && !isUserInTop20() && (
                  <div className="sm:col-span-2 mt-4">
                    <div className="text-center mb-3">
                      <div className="inline-block bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                        <span className="text-sm text-gray-400">───── </span>
                        <span className="text-sm font-semibold text-yellow-400">Your Stats</span>
                        <span className="text-sm text-gray-400"> ─────</span>
                      </div>
                    </div>
                    {renderUserStatsCard(false)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        :root {
          --primary: oklch(0.85 0.35 135);
        }

        .neon-text {
          text-shadow: 0 0 8px var(--primary), 0 0 16px var(--primary),
            0 0 30px var(--primary), 0 0 45px var(--primary);
          animation: pulse 2s ease-in-out infinite;
        }

        .glow-text {
          text-shadow: 0 0 10px rgba(250, 204, 21, 0.8),
                       0 0 20px rgba(250, 204, 21, 0.5),
                       0 0 30px rgba(250, 204, 21, 0.3);
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

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .user-stats-card {
          animation: slide-up 0.5s ease-out;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;