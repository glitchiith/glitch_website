"use client";
import { useEffect, useState } from "react";

export default function RotatingCircle() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setRotation(window.scrollY * 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/8 transform -translate-x-1/2 -translate-y-1/2 z-20">
      <img
        src="/images/rotator.png"
        alt="Rotating Circle"
        style={{ transform: `rotate(${rotation}deg)` }}
        className="w-32 h-32"
      />
    </div>
  );
}
