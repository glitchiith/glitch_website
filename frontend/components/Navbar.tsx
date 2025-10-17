"use client";
import * as React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCookie, deleteCookie } from "cookies-next";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const leftLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Insights", href: "/blogs" },
];

const rightLinks = [
  { name: "Projects", href: "/projects" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Contact Us", href: "/contact" },
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      deleteCookie("authToken", { path: "/" });
      deleteCookie("guestMode", { path: "/" });
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header
      className="w-full flex items-center justify-between px-8 py-12 relative z-50"
      style={{ background: "var(--header-bg)" }}
    >
      {/* LEFT NAV */}
      <nav className="hidden md:flex space-x-6">
        {leftLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setActiveLink(link.href)}
            className={cn(
              "text-foreground text-sm sm:text-base transition-colors flex items-center py-1",
              activeLink === link.href
                ? "bg-primary text-primary-foreground px-2 rounded-full"
                : "hover:bg-transparent"
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* LOGO CENTER */}
      <div className="flex items-center justify-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <Image
          src="/logo-nobg.png"
          alt="Glitch Logo"
          width={48}
          height={48}
          priority
        />
        <span
          className="text-4xl font-bold text-primary"
          style={{ textShadow: "0 0 30px #00ff00" }}
        >
          GLITCH
        </span>
      </div>

      {/* RIGHT NAV + LOGIN */}
      <div className="hidden md:flex items-center space-x-6">
        {rightLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setActiveLink(link.href)}
            className={cn(
              "text-foreground text-sm sm:text-base transition-colors flex items-center py-1",
              activeLink === link.href
                ? "bg-primary text-primary-foreground px-2 rounded-full"
                : "hover:bg-transparent"
            )}
          >
            {link.name}
          </Link>
        ))}

        <div className="ml-4">
          {isLoggedIn ? (
            <button
              className="bg-primary text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-red-500 hover:scale-105"
              style={{ boxShadow: "0 2px 16px 0 #00ff00" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-primary text-white text-base font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-green-600 hover:scale-105"
              style={{ boxShadow: "0 2px 16px 0 #00ff00" }}
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background p-4 shadow-lg z-50">
          {[...leftLinks, ...rightLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setActiveLink(link.href);
                setIsMenuOpen(false);
              }}
              className={cn(
                "block text-foreground text-sm py-2 transition-colors",
                activeLink === link.href
                  ? "bg-primary text-primary-foreground px-2 rounded-full"
                  : "hover:bg-transparent"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
