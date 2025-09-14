"use client";

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface CosmicBackgroundProps {
  className?: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ className }) => {
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden rounded-xl", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-sidebar opacity-95" />
      <div className="absolute inset-0">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={style}
          />
        ))}
      </div>
    </div>
  );
};