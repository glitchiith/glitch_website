import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '../components/ui/glitch_effect.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glitch IIT H",
  description: "Glitch IIT H is gaming club of IIT Hyderabad",
    icons: {
        icon: '/logo-nobg.png',
      },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
   >
      <Navbar />
          <main className="min-h-screen">{children}</main>
      <Footer />
      </body>
    </html>
  );
}