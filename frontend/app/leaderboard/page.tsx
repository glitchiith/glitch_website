"use client";

import { Games_Forward } from "@/lib/constants/games";
import { HOSTELS } from "@/lib/constants/hostels";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Trophy, Medal, Crown, Star, Users, Zap } from "lucide-react";
import { getCookie } from "cookies-next";

interface HostelScore {
  rank: number;
  hostel_id: number | null;
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

interface PlayerBackend {
  uid: string;
  name: string;
  hostel_id?: number | null;
  [key: string]: any;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<"overall" | "games" | "players">("overall");
  const [selectedGame, setSelectedGame] = useState<number>(1);
  const [allScores, setAllScores] = useState<PlayerBackend[]>([]);
  const [overallData, setOverallData] = useState<HostelScore[]>([]);
  const [gameData, setGameData] = useState<HostelScore[]>([]);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  const topPlayers = useMemo(() => playerData.slice(0, 20), [playerData]);

  const currentUser = useMemo(() => {
    if (!userStats || !isAuthenticated) return null;
    return playerData.find(p => p.uid === userStats.uid) || null;
  }, [playerData, userStats, isAuthenticated]);

  const isUserInTop20 = useMemo(() => {
    if (!currentUser) return false;
    return topPlayers.some(p => p.uid === currentUser.uid);
  }, [currentUser, topPlayers]);

  useEffect(() => {
    const token = getCookie("authToken");
    const uid = getCookie("uid");
    setIsAuthenticated(!!token && !!uid);
  }, []);

  // Fetch both overall leaderboard AND player scores
  const fetchAllScores = async () => {
    setLoading(true);
    try {
      const token = getCookie("authToken");

      // Fetch player scores (for games/players tabs)
      const scoresRes = await fetch(`https://backend.glitchiith.co.in/api/get-scores`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (scoresRes.ok) {
        const scoresData = await scoresRes.json();
        if (scoresData.scores && Array.isArray(scoresData.scores)) {
          setAllScores(scoresData.scores);
        }
      }

      // Fetch overall hostel leaderboard (weighted, from backend)
      const leaderboardRes = await fetch(`https://backend.glitchiith.co.in/api/leaderboard/hostels`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json();
        if (leaderboardData.leaderboard && Array.isArray(leaderboardData.leaderboard)) {
          setOverallData(leaderboardData.leaderboard);
        }
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllScores();
  }, []);

  useEffect(() => {
    const bars = document.querySelectorAll(".bar-fill");
    bars.forEach((bar: any) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width;
    });
  }, [overallData]);

  // Calculate ONLY game-specific and player data (NOT overall)
  useEffect(() => {
    if (!allScores.length) return;

    // Game-specific hostel rankings (recalculated per game)
    const hostelMap: Record<number | string, HostelScore> = {};
    allScores.forEach((p) => {
      const hostelId = p.hostel_id ?? -1;
      if (!hostelMap[hostelId]) {
        hostelMap[hostelId] = {
          rank: 0,
          hostel_id: p.hostel_id ?? null,
          hostel_name: hostelId === -1 ? "Unassigned" : HOSTELS[hostelId] || `Hostel ${hostelId}`,
          total_score: 0,
          participant_count: 0,
          score_percentage: 0,
        };
      }
      // Only sum scores for the SELECTED game
      hostelMap[hostelId].total_score += p[`bestScore${selectedGame}`] || 0;
      hostelMap[hostelId].participant_count! += 1;
    });

    let gameArray = Object.values(hostelMap)
      .sort((a, b) => b.total_score - a.total_score)
      .map((h, index, arr) => {
        const rank = index + 1;
        const maxScore = arr[0]?.total_score || 1;
        const score_percentage = maxScore ? Math.sqrt(h.total_score / maxScore) * 100 : 0;
        return { ...h, rank, score_percentage };
      });

    setGameData(gameArray);

    // Player rankings (recalculated per game)
    const players: Player[] = allScores
      .map((p) => ({
        uid: p.uid,
        name: p.name,
        hostel_name: p.hostel_id ? HOSTELS[p.hostel_id] || `Hostel ${p.hostel_id}` : "Unassigned",
        score: p[`bestScore${selectedGame}`] || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((p, idx) => ({ ...p, rank: idx + 1 }));
    setPlayerData(players);

    // User stats
    const tokenUid = getCookie("uid");
    if (tokenUid) {
      const user = players.find((p) => p.uid === tokenUid);
      if (user) {
        setUserStats({
          uid: user.uid!,
          name: user.name,
          hostel_id: null,
          hostel_name: user.hostel_name,
          game: {
            game_id: selectedGame,
            game_name: Games_Forward[selectedGame as keyof typeof Games_Forward].game_name,
            score: user.score,
            rank: user.rank,
            in_top_20: user.rank <= 20,
          },
        });
      }
    }
  }, [selectedGame, allScores]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-green-800 to-green-700";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const renderUserStatsCard = (isInList: boolean = false) => {
    const gameStats = userStats?.game;
    if (!gameStats) return null;

    return (
      <div
        className={`relative bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-amber-900/30 backdrop-blur-sm rounded-lg p-4 border-2 ${isInList ? 'border-yellow-500' : 'border-amber-500'
          } transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50 user-stats-card min-w-0`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 rounded-lg animate-pulse-slow"></div>
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
            <p className="text-2xl font-bold text-yellow-400 glow-text">{gameStats.score.toLocaleString()}</p>
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
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text">
            LEADERBOARD
          </h1>
          <br />
          <p className="text-xl text-[var(--primary)]">
            Glitch's Inter-Hostel Gaming Championship
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { tab: "overall", icon: <Users className="inline w-5 h-5 mr-2" />, label: "Overall" },
            { tab: "games", icon: <Zap className="inline w-5 h-5 mr-2" />, label: "Game-wise" },
            { tab: "players", icon: <Trophy className="inline w-5 h-5 mr-2" />, label: "Top Players" },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${activeTab === tab
                  ? "bg-gradient-to-r from-green-900 to-green-800 shadow-lg shadow-[var(--primary)]/70 scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {(activeTab === "games" || activeTab === "players") && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((gameNum) => (
              <button
                key={gameNum}
                onClick={() => setSelectedGame(gameNum)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedGame === gameNum
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

      <div className="max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--primary)]">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Overall Hostels - Backend weighted scores */}
            {activeTab === "overall" && (
              <div ref={barsRef} className="space-y-4 px-2 md:px-0">
                {overallData.map((hostel) => (
                  <div
                    key={hostel.hostel_id}
                    className="bg-gray-900/60 rounded-lg p-4 border border-gray-800 hover:border-[var(--primary)] transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getRankColor(hostel.rank)}`}>
                          {getRankIcon(hostel.rank)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{hostel.hostel_name}</h3>
                          <p className="text-sm text-gray-400">{hostel.participant_count} participants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[var(--primary)]">{Math.round(hostel.total_score)}</p>
                        {/* <p className="text-sm text-gray-400">Total weighted Score</p> */}
                      </div>
                    </div>

                    <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`bar-fill absolute h-full bg-gradient-to-r ${getRankColor(hostel.rank)} transition-all duration-1000 ease-out`}
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

            {/* Games - Game-specific hostel scores */}
            {activeTab === "games" && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar box-border">
                {gameData.map((item) => (
                  <div
                    key={item.hostel_id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-[var(--primary)] transition-all duration-300 flex items-center justify-between min-w-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(item.rank)} flex items-center justify-center font-bold`}>
                        {item.rank}
                      </div>
                      <h3 className="text-lg font-bold truncate">{item.hostel_name}</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{item.total_score.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Players - Game-specific player scores */}
            {activeTab === "players" && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar box-border overflow-x-hidden">
                {topPlayers.map((item) => {
                  const isCurrentUser = isAuthenticated && currentUser && item.uid === currentUser.uid;
                  if (isCurrentUser) {
                    return (
                      <div key={item.rank} className="sm:col-span-2 min-w-0">
                        {renderUserStatsCard(true)}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={item.rank}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-green-400 transition-all duration-300 flex items-center justify-between min-w-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(item.rank)} flex items-center justify-center font-bold`}>{item.rank}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold truncate">{item.name}</h3>
                          <p className="text-sm text-gray-400 truncate">{item.hostel_name}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-400">{item.score.toLocaleString()}</p>
                    </div>
                  );
                })}

                {isAuthenticated && currentUser && !isUserInTop20 && (
                  <div className="sm:col-span-2 mt-4 min-w-0">{renderUserStatsCard(false)}</div>
                )}
              </div>
            )}
            <div className="max-w-full bg-gray-900/40 border border-gray-800 rounded-lg px-6 py-4 text-sm text-gray-300 leading-relaxed space-y-1 flex items-start gap-4">
              <div className="mt-1 text-yellow-400 flex-shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="font-semibold text-base text-yellow-300">Note</h4>
                <ul className="space-y-2 list-disc list-inside">
                  <li className="text-gray-200">
                    Overall Hostels are calculated by summing up overall scores of top 50 players from respective hostel.
                  </li>
                  <li className="text-gray-200">
                    Each individual game score is scaled appropriately and added together to evaluate overall player score.
                  </li>
                  <li className="text-gray-200">
                    Game-wise standings are calculated by adding player's scores for each hostel. (No top 50 business)
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}


      </div>

      <style jsx>{`
        :root { --primary: oklch(0.85 0.35 135); overflow-x: hidden; }
        .neon-text { text-shadow: 0 0 8px var(--primary),0 0 16px var(--primary),0 0 30px var(--primary),0 0 45px var(--primary); animation: pulse 2s ease-in-out infinite; }
        .glow-text { text-shadow: 0 0 10px rgba(250,204,21,0.8),0 0 20px rgba(250,204,21,0.5),0 0 30px rgba(250,204,21,0.3); }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.9;} }
        @keyframes pulse-slow { 0%,100% { opacity:0.3;} 50%{opacity:0.5;} }
        @keyframes bounce-slow { 0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);} }
        .animate-pulse-slow{animation:pulse-slow 3s ease-in-out infinite;}
        .animate-bounce-slow{animation:bounce-slow 2s ease-in-out infinite;}
        .user-stats-card {animation: slide-up 0.5s ease-out;}
        @keyframes slide-up { from{opacity:0; transform:translateY(20px);} to{opacity:1; transform:translateY(0);} }
        .custom-scrollbar::-webkit-scrollbar{width:8px; height: 0;} /* Hide horizontal scrollbar */
        .custom-scrollbar::-webkit-scrollbar-thumb{background:var(--primary); border-radius:10px;}
        .box-border { box-sizing: border-box; }
      `}</style>

    </div>
  );
};

export default LeaderboardPage;