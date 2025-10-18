"use client";
import Link from "next/link";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© Copyright ${currentYear} by Glitch Club - All rights reserved `;
  
  return (
    <footer 
      className="w-full border-t border-zinc-800 px-6 py-6 text-sm text-zinc-400"
      style={{ background: "var(--footer-bg)" }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center mb-15">
        {/* Contact Section */}
        <div className="w-full md:w-1/3 mb-4 md:mb-0 text-left">
          <p className="uppercase text-1.5xl font-bold text-zinc-500">Send Mail</p>
          <a
            href="mailto:glitch@iith.ac.in"
            className="text-white font-semibold text-base hover:underline hover:text-green-400 transition-colors"
          >
            glitch@gymkhana.iith.ac.in
          </a>
          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a 
              href="https://www.instagram.com/glitch.iith" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/company/glitch-iith" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Logo Section */}
        <div className="w-full md:w-1/3 flex justify-center items-center mb-4 md:mb-0">
          <img src="/logo-nobg.png" alt="Glitch Logo" className="h-12 mr-2" />
          <span
            className="text-4xl font-bold text-primary"
            style={{
              textShadow: "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00",
            }}
          >
            GLITCH
          </span>
        </div>

        {/* Navigation Links */}
        <div className="w-full md:w-1/3 flex flex-col items-end">
          <nav className="flex flex-col gap-2">
            <Link 
              href="/" 
              className="text-white hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-white hover:text-green-400 transition-colors"
            >
              Leaderboard
            </Link>
          </nav>
        </div>
      </div>

      {/* Made with Love Section */}
      <div className="max-w-6xl mx-auto w-full flex justify-center items-center mt-8">
        <p className="font-bold text-green-400">Made with ❤️ by Lambda</p>
      </div>

      {/* Animated Banner */}
      <div className="marquee w-full mt-4 overflow-hidden bg-black/50 text-green-400 py-2">
        <style jsx>{`
          .marquee-content {
            display: inline-block;
            animation: marquee 120s linear infinite;
            white-space: nowrap;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
        {/* <div className="marquee-content">
          {Array(20).fill(`© ${currentYear} GLITCH CLUB IITH • `).join(' ')}
        </div> */}
      </div>
    </footer>
  );
}