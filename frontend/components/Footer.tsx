// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© Copyright ${currentYear} by Glitch Club - All rights reserved `;
  const copyrightItems = Array(50).fill(copyrightText);
  return (
    <footer 
    className="w-full  border-t border-zinc-800  px-6 py-6 text-sm text-zinc-400"
          style={{ background: "var(--footer-bg)" }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center mb-15">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 text-left">
          <p className="uppercase text-1.5xl font-bold text-zinc-500">Send Mail</p>
          <a
            href="mailto:glitch@iith.ac.in"
            className="text-white font-semibold text-base hover:underline"
          >
            glitch@iith.ac.in
          </a>
        </div>

        <div className="w-full md:w-1/3 flex justify-center items-center mb-4 md:mb-0">
          <img src="/logo-nobg.png" alt="Glitch Logo" className="h-12 mr-2" />
          <span
            className="text-4xl font-bold text-primary"
            style={{
              textShadow:
                "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00",
            }}
          >
            GLITCH
          </span>
        </div>

        <div className="w-full md:w-1/3 mb-4 md:mb-0 text-right">
          <p className="uppercase text-1.5xl font-bold text-zinc-500">Call Now</p>
          <p className="text-white font-semibold text-base">0123456789</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="font-bold">Made with ❤️ by Lambda</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-green-400 transition">
            About
          </Link>
          <Link href="/team" className="hover:text-green-400 transition">
            Team
          </Link>
          <Link href="/blogs" className="hover:text-green-400 transition">
            Blogs
          </Link>
          <Link href="/projects" className="hover:text-green-400 transition">
            Projects
          </Link>
        </div>
      </div>

      <div className="marquee w-full mt-4 overflow-hidden bg-black text-green-400 py-2">
        <style>
          {`
            .marquee-content {
              display: inline-block;
              animation: marquee 120s linear infinite;
              color: #00ff00;
              padding-right: 40px; /* Gap between items */
            }
            .marquee-item {
            margin-right: 20px; /* Gap between each copyright */
            white-space: nowrap;
            }
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
        <div className="marquee-content whitespace-nowrap">
          {copyrightItems.map((item, index) => (
            <span key={index} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}