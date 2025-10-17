"use client";
import { useEffect, useState, useRef } from "react";

export default function TimelineProgress() {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!progressRef.current) return;

      const section = progressRef.current.parentElement;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      let scrollProgress = 0;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
        scrollProgress = ((windowHeight - rect.top) / (windowHeight + rect.height)) * 100;

        scrollProgress = Math.max(0, Math.min(100, scrollProgress));
      }

      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={progressRef}
      className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700 z-0"
    >
      <div
        className="bg-green-400 w-full transition-all duration-150 ease-linear origin-top"
        style={{ height: `${progress}%` }}
      ></div>
    </div>
  );
}
