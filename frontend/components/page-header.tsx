// components/ui/page-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
    title: string;
    imageUrl?: string;
     showImage?: boolean; //
}

export default function PageHeader({ title, imageUrl,  showImage = true, }: PageHeaderProps) {
    const pathname = usePathname();

    const segments = pathname
        .split("/")
        .filter((seg) => seg !== "");

  const breadcrumbs = [
  { label: "Home", href: "/" },
  ...segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = seg.replace(/-/g, " "); // avoid any uppercasing
    return { label, href };
  }),
];

  // condition to decide if image should be displayed
  const shouldShowImage = showImage && !!imageUrl;

  // adjust height dynamically
  const headerHeight = shouldShowImage ? "h-[320px] md:h-[550px]" : "h-[220px] md:h-[320px]";

    return (
        <div className="relative w-full h-[320px] md:h-[550px] overflow-hidden text-white">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 bg-[url('/images/page-header-bg.png')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50" />
            {/* Optional dark overlay */}
            <div className="absolute inset-0 bg-black/50 z-0" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center gap-6">
                {/* Breadcrumbs */}
                <div className="text-sm text-neutral-300 flex items-center gap-2 flex-wrap">
                    {breadcrumbs.map((crumb, idx) => (
                        <span key={idx} className="flex items-center gap-2 uppercase">
                            <Link href={crumb.href} className="hover:text-white transition">
                                {crumb.label}
                            </Link>
                            {idx < breadcrumbs.length - 1 && <span className="text-green-400">&gt;</span>}
                        </span>
                    ))}
                </div>

               
               
                {/* Title + Image in Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-6">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-wider uppercase text-center sm:text-left">
                    {title}
                </h1>

          {/* Conditionally render image */}
          {shouldShowImage && (
            <div className="hidden sm:block relative w-90 h-90 md:w-95 md:h-95 rounded-full overflow-visible shrink-0">
              <div className="absolute w-full h-full flex justify-end">
                <div className="relative w-90 h-90 bg-gradient-to-b from-green-700 to-green-0 rounded-full opacity-100"></div>
              </div>
              <img
                src={imageUrl}
                alt="Character"
                className="h-110 relative translate-x-[20px] translate-y-[-25px]"
              />
            </div>
          )}
                </div>

            </div>
        </div>
    );
}
