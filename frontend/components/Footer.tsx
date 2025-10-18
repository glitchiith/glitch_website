"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (currentYear === null) return null;

  return (
    <footer
      className="w-full border-t border-zinc-800 bg-site text-zinc-400 px-6 py-10 text-sm"
    >
      {/* --- DESKTOP / TABLET VIEW --- */}
      <div className="hidden md:flex max-w-6xl mx-auto w-full flex-row justify-between items-center">
        {/* Contact Section */}
        <div className="w-1/3 text-left">
          <p className="uppercase text-lg font-semibold text-zinc-500 mb-2">Contact</p>
          <div className="flex gap-4 mt-2">
            <a
              href="mailto:glitch@gymkhana.iith.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
              title="Email"
            >
              <FaEnvelope size={22} />
            </a>
            <a
              href="https://www.instagram.com/glitch.iith"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
              title="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://www.linkedin.com/company/glitch-iith"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
              title="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://github.com/glitchiith"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
              title="GitHub"
            >
              <FaGithub size={22} />
            </a>
          </div>
        </div>

        {/* Logo Section */}
        <div className="w-1/3 flex flex-col justify-center items-center">
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <img src="/logo-nobg.png" alt="Glitch Logo" className="h-12 w-auto" />
              <span
                className="text-4xl font-bold text-primary"
                style={{
                  textShadow: "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00",
                }}
              >
                GLITCH
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="w-1/3 flex flex-col items-end">
          <nav className="flex flex-col gap-2 text-base">
            <Link href="/" className="text-white hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link href="/leaderboard" className="text-white hover:text-green-400 transition-colors">
              Leaderboard
            </Link>
          </nav>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="flex flex-col items-center justify-center gap-6 md:hidden">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <img src="/logo-nobg.png" alt="Glitch Logo" className="h-12 w-auto" />
            <span
              className="text-4xl font-bold text-primary"
              style={{
                textShadow: "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00",
              }}
            >
              GLITCH
            </span>
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-white">
          <a
            href="mailto:glitch@gymkhana.iith.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors"
            title="Email"
          >
            <FaEnvelope size={22} />
          </a>
          <a
            href="https://www.instagram.com/glitch.iith"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors"
            title="Instagram"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://www.linkedin.com/company/glitch-iith"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors"
            title="LinkedIn"
          >
            <FaLinkedin size={22} />
          </a>
          <a
            href="https://github.com/glitch-iith"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors"
            title="GitHub"
          >
            <FaGithub size={22} />
          </a>
        </div>

        {/* Navigation Links (horizontal) */}
        <nav className="flex gap-8 text-white font-medium text-base">
          <Link href="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>
          <Link href="/leaderboard" className="hover:text-green-400 transition-colors">
            Leaderboard
          </Link>
        </nav>
      </div>

      {/* --- Made with Love (Visible on all screens) --- */}
      <div className="flex flex-col items-center mt-8 text-center">
        <p className="font-bold text-green-400 text-sm">
          Made with ❤️ by Lambda
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          © {currentYear} Glitch Club — All rights reserved
        </p>
      </div>

      {/* --- Optional Animated Banner --- */}
      {/* <div className="marquee w-full mt-8 overflow-hidden bg-black/50 text-green-400 py-2 hidden md:block"> */}
        {/* <style jsx>{`
          .marquee-content {
            display: inline-block;
            animation: marquee 120s linear infinite;
            white-space: nowrap;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}</style> */}
        {/* Uncomment if you want the banner */}
        {/* <div className="marquee-content">
          {Array(20).fill(\`© ${currentYear} GLITCH CLUB IITH • \`).join(' ')}
        </div> */}
      {/* </div> */}
    </footer>
  );
}
