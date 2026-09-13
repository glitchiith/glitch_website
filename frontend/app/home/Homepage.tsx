"use client";
import HomeLeaderboardSection from "@/components/HomeLeaderboardSection";
import CompetitionEntry from "@/components/CompetitionEntry";

export default function HomePage() {
  return (
    <>
      <CompetitionEntry />
      {/* Leaderboard */}
      <HomeLeaderboardSection />

      {/* About Section */}
      <div className="w-full min-h-[90vh] bg-site flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12">
        <div className="w-full lg:w-1/2 p-6 lg:p-12 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 lg:mb-12">
            ABOUT US
          </h1>
          <br />
          <p className="text-white text-base md:text-lg leading-relaxed">
            Glitch, the epicenter of gaming and game development at IITH. Join
            thrilling tournaments, workshops, and coding sessions.
          </p>
          {/* <Link href="/about">
            <button className="mt-8 bg-green-500 text-black px-5 md:px-6 py-3 rounded-lg text-base md:text-lg hover:bg-white transition">
              NEXT CAN BE YOU →
            </button>
          </Link> */}
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


      <div className="w-full h-24 bg-site" />

    </>
  );
}
