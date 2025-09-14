"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScientificBasis from "@/components/ScientificBasis";
import TarotSpread from "@/components/TarotSpread";
import PredictionPurchase from "@/components/PredictionPurchase";
import PersonalCabinet from "@/components/PersonalCabinet";
import Footer from "@/components/Footer";

export const HomeClient = () => {
  const [isPersonalCabinetOpen, setIsPersonalCabinetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePurchaseComplete = (success: boolean) => {
    if (success) {
      console.log('Purchase completed successfully');
    } else {
      console.log('Purchase failed');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 z-0">
        {/* Cosmic background (deterministic for SSR) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 232, 155, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(155, 140, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
        {/* Starfield texture (deterministic) */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px, #fff, transparent),
              radial-gradient(1px 1px at 40px 70px, rgba(255, 232, 155, 0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(155, 140, 255, 0.8), transparent),
              radial-gradient(1px 1px at 130px 80px, #fff, transparent),
              radial-gradient(1px 1px at 160px 30px, rgba(255, 232, 155, 0.8), transparent)
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 100px'
          }}
        />
      </div>

      {/* Header */}
      <Header onPersonalCabinetOpen={() => setIsPersonalCabinetOpen(true)} />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 space-y-16 md:space-y-24">
        <HeroSection />
        <ScientificBasis />
        <TarotSpread />
        <PredictionPurchase onPurchaseComplete={handlePurchaseComplete} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Personal Cabinet */}
      <PersonalCabinet 
        isOpen={isPersonalCabinetOpen} 
        onClose={() => setIsPersonalCabinetOpen(false)}
        isMobile={isMobile}
      />
    </div>
  );
};