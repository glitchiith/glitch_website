"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { toast, Toaster } from "sonner";
import { Trophy, Crown, Medal, ArrowRight, Gamepad2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface HostelLeaderboard {
    rank: number;
    hostel_name: string;
    total_score: number;
    score_percentage: number;
}

const HomeLeaderboardSection = () => {
    const [leaderboardData, setLeaderboardData] = useState<HostelLeaderboard[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const barsRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    // Check mobile and login status
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const token = !!getCookie("authToken");
        setIsLoggedIn(token);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Fetch leaderboard and take top 3 only
    useEffect(() => {
        if (typeof window === "undefined") return;
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard/hostels");
                const data = await response.json();
                console.log("Leaderboard data:", data.leaderboard);
                if (data.leaderboard) {
                    // Show top 3 only
                    const topHostels = data.leaderboard.slice(0, 3);
                    setLeaderboardData(topHostels);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                toast.error("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // GSAP Animations
    useEffect(() => {
        if (!loading && leaderboardData.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from(titleRef.current, {
                    opacity: 0,
                    y: -50,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });


                gsap.from(".bar-fill-home", {
                    width: 0,
                    duration: 1.5,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: barsRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });

                gsap.from(buttonsRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: buttonsRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                });
            }, sectionRef);

            return () => ctx.revert();
        }
    }, [loading, leaderboardData]);

    // Handle game button click
    const handleGameClick = () => {
        if (!isMobile) {
            if (isLoggedIn) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.success("Scrolling to game...");
            } else {
                window.location.href = "/login";
            }
        } else {
            toast.error("Game is only accessible on desktop!", {
                description: "Please switch to a desktop device to play.",
                duration: 4000,
            });
        }
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return "from-yellow-400 via-yellow-500 to-yellow-600";
        if (rank === 2) return "from-gray-300 via-gray-400 to-gray-500";
        if (rank === 3) return "from-orange-400 via-orange-500 to-orange-600";
        return "from-cyan-400 via-cyan-500 to-blue-600";
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
        return <Trophy className="w-5 h-5 text-cyan-400" />;
    };

    if (loading) {
        return (
            <div className="w-full min-h-[50vh] bg-[#0B0F13] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <Toaster
                position="top-center"
                richColors
                theme="dark"
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        border: '1px solid #00ffff',
                        color: '#fff',
                    },
                }}
            />

            <div
                ref={sectionRef}
                className="w-full min-h-[50vh] bg-[#0B0F13] relative overflow-hidden py-8 px-6 lg:px-8"
            >
                {/* Background glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <h2
                        ref={titleRef}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4"
            
                    >
                        🏆 HOSTEL LEADERBOARD 🏆
                    </h2>
                    <p className="text-center text-white text-lg mb-8">
                        Inter-Hostel Gaming Championship Standings
                    </p>

                    {/* Leaderboard entries */}
                    <div ref={barsRef} className="space-y-3 mb-4">
                        {leaderboardData.map((hostel) => (
                            <div
                                key={hostel.rank}
                                className="leaderboard-entry bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(hostel.rank)} shadow-lg`}>
                                                {getRankIcon(hostel.rank)}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">{hostel.hostel_name}</h3>
                                                <p className="text-sm text-gray-400">Rank #{hostel.rank}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-primary neon-text-score">
                                                {hostel.total_score.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-400">Total Points</p>
                                        </div>
                                    </div>

                                    <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={`bar-fill-home absolute h-full bg-gradient-to-r ${getRankColor(hostel.rank)} shadow-lg transition-all duration-300`}
                                            style={{ width: `${hostel.score_percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                                        </div>
                                    </div>

                                    <p className="text-right text-xs text-gray-500 mt-1">
                                        {hostel.score_percentage.toFixed(1)}% of top score
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <button
                            onClick={handleGameClick}
                            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 neon-button-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                <Gamepad2 className="w-5 h-5" />
                                {isLoggedIn ? "GO TO GAME" : "WANNA PARTICIPATE?"}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 rounded-lg blur-xl bg-green-500/30 -z-10 group-hover:bg-green-500/50 transition-all duration-300"></div>
                        </button>

                        <Link href="/leaderboard" className="w-full sm:w-auto">
                            <button className="group relative w-full px-8 py-4 bg-transparent border-2 border-primary text-primary font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-cyan-500/10 hover:shadow-2xl hover:shadow- neon-button-right">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    SEE FULL LEADERBOARD
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 rounded-lg blur-xl bg-cyan-500/20 -z-10 group-hover:bg-cyan-500/40 transition-all duration-300"></div>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .neon-title {
                    text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
                    animation: pulse-glow 3s ease-in-out infinite;
                }
                .neon-text-score {
                    text-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4;
                }
                @keyframes pulse-glow {
                    0%, 100% { 
                        text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
                        opacity: 1; 
                    }
                    50% { 
                        text-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff, 0 0 45px #00ffff;
                        opacity: 0.9; 
                    }
                }
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shine {
                    animation: shine 3s ease-in-out infinite;
                }
                .neon-button-left:hover {
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 
                                0 0 40px rgba(34, 197, 94, 0.4),
                                0 0 60px rgba(34, 197, 94, 0.2);
                }
                .neon-button-right:hover {
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 
                                0 0 40px rgba(0, 255, 255, 0.4),
                                0 0 60px rgba(0, 255, 255, 0.2);
                }

            `}</style>
        </>
    );
};

export default HomeLeaderboardSection;
