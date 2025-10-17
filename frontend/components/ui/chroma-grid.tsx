"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { GREEN } from "@/lib/constants";
import { Black_And_White_Picture } from "next/font/google";

// Type for each grid item
export interface ChromaItem {
  image: string;
  title: string;
  subtitle?: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  year?: string;
}

// Props for the ChromaGrid component
export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = " py-20",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  // Refs for root element, fade overlay, and GSAP setters
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  // Demo data if no items are passed
  const demo: ChromaItem[] = [
    // ...existing code...
  ];

  // Use provided items or fallback to demo
  const data = items?.length ? items : demo;

  /**
   * Initializes GSAP quickSetters for CSS variables --x and --y,
   * and sets their initial values to the center of the grid.
   */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  /**
   * Animates the spotlight position to (x, y) using GSAP.
   * Updates CSS variables --x and --y for the grid.
   */
  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  /**
   * Handles pointer movement over the grid.
   * Moves the spotlight to the pointer position and fades out the overlay.
   */
  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  /**
   * Handles pointer leaving the grid.
   * Fades the overlay back in.
   */
  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  /**
   * Opens the card's URL in a new tab when clicked.
   */
  const handleCardClick = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  /**
   * Tracks mouse position over each card and sets CSS variables
   * --mouse-x and --mouse-y for spotlight effect on hover.
   */
  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // Render the grid
  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
     className={`relative w-full h-full px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32  ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--x": "50%",
          "--y": "50%",
        } as React.CSSProperties
      }
    >

        <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full mx-auto"
      style={{
        maxWidth: "1600px",
        background:"var(--body-bg-light)"

      }}
    >
      
      {/* Render each card */}
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
           className="group relative flex flex-col
            w-full
            max-w-[95vw]
            sm:max-w-[48vw]
            lg:max-w-[32vw]
            xl:max-w-[500px]
            2xl:max-w-[500px]
            rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
          style={
            {
              "--card-border": c.borderColor || "transparent",
              background: c.gradient,
              "--spotlight-color":"rgba(255,255,255,0.3)",
            } as React.CSSProperties
          }
        >
          {/* Spotlight effect on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
            }}
          />
          {/* Card image */}
          <div className="relative z-10 flex-1 p-[10px] box-border">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              className="w-full h-full object-cover rounded-[10px] "
            />
          </div>
          {/* Card footer with details */}
          <footer className="relative z-10 p-3 flex flex-col text-white font-sans gap-3 ">
           
           <h2 className="m-0 text-[2rem] opacity-85  text-green-500 font-semibold">{c.subtitle}</h2>
           
            <h3 className="m-0 text-[2.5rem] font-semibold">{c.title}</h3>
            
            {/* {c.handle && (
              <h2 className="text-[0.95rem] opacity-80 text-right">
                {c.handle}
              </h2>
            )} */}

            
            {c.year && (
              <span className="text-[1.5rem] opacity-85">{c.year}</span>
            )}


            {/* {c.location && (
              <span className="text-[0.85rem] opacity-85 text-right">
                {c.location}
              </span>
            )} */}
          </footer>
        </article>

      ))}
    </div>


      {/* Overlay for spotlight mask */}
<div
  className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 group-hover:opacity-0"
  style={{
    backdropFilter: "grayscale(0.5) brightness(0.9)",
    WebkitBackdropFilter: "grayscale(0.5) brightness(0.9)",
    background: "rgba(0,0,0,0.001)",
    maskImage:
      "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
    WebkitMaskImage:
      "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
  }}
/>


      {/* Fade overlay for pointer leave */}
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: "grayscale(0.5) brightness(0.9)",
          WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
          background: "rgba(0,0,0,0.001)",
          maskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
          opacity: 1,
        }}
      />
    </div>
  );
};

export default ChromaGrid;