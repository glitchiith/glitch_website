"use client";
import * as React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { handleLogout } from '@/lib/auth';

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Leaderboard", href: "/leaderboard" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeLink, setActiveLink] = React.useState(pathname);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkLogin = () => {
      const token = getCookie("authToken");
      setIsLoggedIn(!!token);
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogin = () => router.push("/login");

  return (
    <header className="w-full flex items-center justify-between px-8 py-6 relative z-50 bg-[#0A0D10] border-b border-zinc-800/40 backdrop-blur-sm">
      {/* LOGO + NAV LINKS */}
      <div className="flex items-center space-x-12">
        <Link href="/" className="flex items-center space-x-2 group">
          <Image
            src="/logo-nobg.png"
            alt="Glitch Logo"
            width={40}
            height={40}
            priority
            className="transition-transform group-hover:scale-110"
          />
          <span
            className="text-3xl font-bold text-green-400"
            style={{ 
              textShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
              letterSpacing: "-0.02em"
            }}
          >
            GLITCH
          </span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={cn(
                "text-base font-medium transition-all duration-200 px-4 py-2 rounded-lg",
                activeLink === link.href
                  ? "bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(0,255,0,0.1)]"
                  : "text-zinc-400 hover:text-green-400 hover:bg-green-500/5"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* LOGIN/LOGOUT BUTTON */}
      <div className="hidden md:block">
        {isLoggedIn ? (
          <button
            className="bg-red-500/10 text-red-400 text-sm font-semibold px-6 py-2.5 rounded-lg 
                     transition-all duration-200 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.15)]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-green-500/10 text-green-400 text-sm font-semibold px-6 py-2.5 rounded-lg 
                     transition-all duration-200 hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(0,255,0,0.15)]"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-zinc-400 hover:text-green-400 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0D10] border-b border-zinc-800/40 p-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "text-base font-medium transition-all duration-200 px-4 py-2 rounded-lg",
                  activeLink === link.href
                    ? "bg-green-500/10 text-green-400"
                    : "text-zinc-400 hover:text-green-400 hover:bg-green-500/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile Login/Logout Button */}
            {isLoggedIn ? (
              <button
                className="text-left text-red-400 text-base font-medium px-4 py-2 rounded-lg 
                         hover:bg-red-500/10 transition-all duration-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="text-left text-green-400 text-base font-medium px-4 py-2 rounded-lg 
                         hover:bg-green-500/10 transition-all duration-200"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}