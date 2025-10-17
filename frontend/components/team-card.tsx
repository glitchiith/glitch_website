"use client";

import Image from "next/image";
import Link from "next/link";

interface TeamCardProps {
  name: string;
  slug: string;
  image: string;
  tag: string;
  bio: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

export default function TeamCard({ name, slug, image, tag }: TeamCardProps) {
  return (
    <Link
      href={`/team/${slug}`}
      className="group block overflow-hidden rounded-xl perspective"
    >
      <div className="relative w-full h-[300px] sm:h-[310px] rounded-xl transform-style preserve-3d transition-transform duration-500 group-hover:rotate-[2deg] group-hover:scale-105 hovercard">
        {/* Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-xl z-0"
        />

        {/* Flashlight effect */}
        <div className="flash-overlay" />

        {/* Tag with glow */}
        <span className="absolute top-4 left-4 bg-green-500 text-black font-bold px-5 py-3 text-sm rounded shadow-[0_0_20px_4px_rgba(34,197,94,0.5)] z-10">
          {tag}
        </span>

        {/* Name at bottom */}
        <div className="absolute bottom-0 w-full p-4 bg-black/60 text-white text-center font-bold text-lg uppercase tracking-wide z-10">
          {name}
        </div>
      </div>
    </Link>
  );
}
