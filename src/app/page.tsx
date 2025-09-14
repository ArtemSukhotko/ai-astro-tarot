"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScientificBasis from "@/components/ScientificBasis";
import TarotSpread from "@/components/TarotSpread";
import PredictionPurchase from "@/components/PredictionPurchase";
import PersonalCabinet from "@/components/PersonalCabinet";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [isPersonalCabinetOpen, setIsPersonalCabinetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePurchaseComplete = (purchaseData: any) => {
    console.log('Purchase completed:', purchaseData);
    // Handle post-purchase logic here
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Cosmic background */}
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
        
        {/* Starfield texture */}
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
      <Header 
        onPersonalCabinetOpen={() => setIsPersonalCabinetOpen(true)}
      />

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <div className="container mx-auto px-4 space-y-16 md:space-y-24">
          
          {/* Hero Section */}
          <section id="hero" className="py-8 md:py-16">
            <HeroSection />
          </section>

          {/* Scientific Basis Section */}
          <section id="science" className="py-8 md:py-16">
            <div className="max-w-7xl mx-auto">
              <ScientificBasis />
            </div>
          </section>

          {/* Tarot Spread Section */}
          <section id="tarot" className="py-8 md:py-16">
            <TarotSpread />
          </section>

          {/* Prediction Purchase Section */}
          <section id="prediction" className="py-8 md:py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Полный прогноз
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Получите детальный анализ с персональными рекомендациями от ИИ
                </p>
              </div>
              <PredictionPurchase onPurchaseComplete={handlePurchaseComplete} />
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Personal Cabinet Modal/Drawer */}
      <PersonalCabinet
        isOpen={isPersonalCabinetOpen}
        onClose={() => setIsPersonalCabinetOpen(false)}
        isMobile={isMobile}
      />
    </div>
  );
}