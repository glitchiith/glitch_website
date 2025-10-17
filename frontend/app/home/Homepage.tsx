"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import HomeLeaderboardSection from "@/components/HomeLeaderboardSection";
import { getCookie } from "cookies-next";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detect if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get guest / logged-in state safely
  useEffect(() => {
  const guestCookie = getCookie("guestMode"); // "true" | "false" | undefined
  const token = getCookie("authToken");       // string | undefined

  // Convert string to boolean properly
  const guest = guestCookie === "true"; // only true if cookie is "true"
  setIsGuest(guest);

  setIsLoggedIn(!!token);
}, []);



  // Compute what to show
  const shouldShowVideo = isMobile || isGuest;
  const shouldShowGame = !isMobile && !isGuest;

  // Define getUID for desktop logged-in
  useEffect(() => {
    if (shouldShowGame && isLoggedIn) {
      (window as any).getUID = async () => {
        let token;
        try {
          token = getCookie("authToken");
          if (!token) return null;
        } catch {
          return null;
        }

        try {
          const res = await fetch("/api/get-uid", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return null;

          const data = await res.json();
          return data.uid;
        } catch (err) {
          console.error("Error fetching UID:", err);
          return null;
        }
      };
    } else {
      (window as any).getUID = undefined;
    }

    return () => {
      (window as any).getUID = undefined;
    };
  }, [shouldShowGame, isLoggedIn]);

  // Listen for scores from iframe
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type !== "score") return;

      let token;
      try {
        token = getCookie("authToken");
        if (!token) return;
      } catch {
        return;
      }

      const { gameName, score } = event.data;
      fetch("/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameName, data: score }),
      });
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <>
      {shouldShowVideo && (
        <div className="w-full h-[90vh] bg-gray-100 relative overflow-hidden">
          <video
            className="w-full h-[90vh] object-cover brightness-65"
            src="/glitch_promo.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}

      {shouldShowGame && (
        <div className="w-360 h-200 gi py-0">
          <iframe
            src="/gameglitch/Final/index.html"
            className="w-full h-full border-none"
            title="Topdown Game"
            allowFullScreen
          />
        </div>
      )}

      {/* About Section */}
      <div className="w-full min-h-[90vh] bg-[#0B0F13] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12">
        <div className="w-full lg:w-1/2 p-6 lg:p-12 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 lg:mb-12">
            ABOUT US
          </h1>
          <p className="text-white text-base md:text-lg leading-relaxed">
            Glitch, the epicenter of gaming and game development at IIT. Join
            thrilling tournaments, workshops, and coding sessions.
          </p>
          <Link href="/about">
            <button className="mt-8 bg-green-500 text-black px-5 md:px-6 py-3 rounded-lg text-base md:text-lg hover:bg-white transition">
              NEXT CAN BE YOU →
            </button>
          </Link>
        </div>

        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end p-6 lg:p-12 mt-10 lg:mt-0">
          <div className="absolute inset-0 flex justify-center lg:justify-end items-center">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-b from-green-700 to-green-500 rounded-full blur-3xl opacity-80"></div>
          </div>
          <img
            src="/homepage-1.png"
            alt="Character"
            className="relative h-72 md:h-96 lg:h-[32rem] object-contain z-10"
          />
        </div>
      </div>

      {/* Leaderboard */}
      <HomeLeaderboardSection />
    </>
  );
}
