// components/project-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";


export function ProjectCard({ title, year, genre, image, slug }: Project) {
  return (
    <Link href={`/projects/${slug}`} className="block group">
      <div className="overflow-hidden relative aspect-[4/5] rounded-lg shadow-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4">
        <p className="text-xs text-green-400 uppercase tracking-wide">{genre}</p>
        <h3 className="text-lg font-extrabold text-white leading-tight">{title}</h3>
        <p className="text-sm text-neutral-400">{year}</p>
      </div>
    </Link>
  );
}
