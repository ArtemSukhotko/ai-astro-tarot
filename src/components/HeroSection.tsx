"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BrainCog, Ghost, ScrollText, Sparkles, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { NatalForm } from "./NatalDataForm";
import { NatalChart } from "./NatalChart";

interface NatalData {
  name?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
}

interface ApiResponse {
  success: boolean;
  natalChart: any;
  prediction: any;
  metadata: any;
  error?: string;
}

const HeroSection = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [natalData, setNatalData] = useState<NatalData | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullUnlocked, setIsFullUnlocked] = useState(false);

  const handleFormSubmit = useCallback(async (data: NatalData) => {
    setNatalData(data);
    setStep('loading');
    setError(null);
    
    try {
      const response = await fetch('/api/astrology/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name || 'Аноним',
          birthDate: data.birthDate,
          birthTime: data.birthTime || '12:00',
          birthPlace: data.birthPlace
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Ошибка при расчёте натальной карты');
      }

      setApiResponse(result);
      setStep('result');
      toast.success("Натальная карта рассчитана!");
      
    } catch (err) {
      console.error('Error calculating natal chart:', err);
      setError(err instanceof Error ? err.message : "Произошла ошибка при расчёте");
      setStep('form');
      toast.error("Не удалось рассчитать натальную карту");
    }
  }, []);

  const handlePurchase = useCallback(() => {
    // Simulate purchase logic
    setIsFullUnlocked(true);
    toast.success("Полный прогноз разблокирован!");
  }, []);

  const handleStartOver = useCallback(() => {
    setStep('form');
    setNatalData(null);
    setApiResponse(null);
    setError(null);
    setIsFullUnlocked(false);
  }, []);

  // Transform API response to component format
  const transformApiData = (apiData: ApiResponse) => {
    if (!apiData.natalChart) return null;

    const planets = Object.entries(apiData.natalChart.planets).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      sign: (data as any).sign,
      degree: (data as any).degree,
      house: (data as any).house,
      symbol: getSymbol(name),
      retrograde: (data as any).retrograde
    }));

    const houses = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: 'Aries', // Simplified
      degree: apiData.natalChart.houses[i] || 0,
      ruler: 'Mars' // Simplified
    }));

    const aspects = apiData.natalChart.aspects.map((aspect: any) => ({
      planet1: aspect.planet1,
      planet2: aspect.planet2,
      type: aspect.aspect.toLowerCase(),
      orb: aspect.orb,
      strength: Math.floor(aspect.strength / 20), // Convert to 1-5 scale
      description: getAspectDescription(aspect.planet1, aspect.planet2, aspect.aspect)
    }));

    return {
      natalChart: {
        planets,
        houses,
        aspects,
        signs: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
        ascendant: apiData.natalChart.risingSign,
        midheaven: apiData.natalChart.sunSign // Simplified
      },
      prediction: {
        preview: apiData.prediction.preview,
        full: apiData.prediction.full,
        keyThemes: extractKeyThemes(apiData.prediction.full),
        confidence: apiData.metadata.confidenceScore
      },
      metadata: {
        calculatedAt: apiData.metadata.calculationTime,
        ephemerisSource: apiData.metadata.ephemerisSource,
        timezone: apiData.metadata.coordinatesUsed.timezone,
        coordinates: {
          lat: apiData.metadata.coordinatesUsed.latitude,
          lng: apiData.metadata.coordinatesUsed.longitude
        },
        nasaReference: 'JPL DE431'
      }
    };
  };

  const getSymbol = (planetName: string): string => {
    const symbols: Record<string, string> = {
      sun: '☉',
      moon: '☽',
      mercury: '☿',
      venus: '♀',
      mars: '♂',
      jupiter: '♃',
      saturn: '♄',
      uranus: '♅',
      neptune: '♆',
      pluto: '♇'
    };
    return symbols[planetName.toLowerCase()] || '●';
  };

  const getAspectDescription = (planet1: string, planet2: string, aspect: string): string => {
    const descriptions: Record<string, string> = {
      'Conjunction': 'Усиливает энергии планет',
      'Opposition': 'Создаёт напряжение и полярность',
      'Trine': 'Гармоничное взаимодействие',
      'Square': 'Вызывает конфликт и рост',
      'Sextile': 'Благоприятные возможности'
    };
    return descriptions[aspect] || 'Планетарное взаимодействие';
  };

  const extractKeyThemes = (fullText: string): string[] => {
    // Extract themes from the prediction text
    const themes = [];
    if (fullText.includes('карьера') || fullText.includes('работа')) themes.push('Карьера');
    if (fullText.includes('отношения') || fullText.includes('любовь')) themes.push('Отношения');
    if (fullText.includes('здоровье')) themes.push('Здоровье');
    if (fullText.includes('финансы') || fullText.includes('деньги')) themes.push('Финансы');
    if (fullText.includes('духовн') || fullText.includes('развитие')) themes.push('Духовность');
    if (fullText.includes('творчество')) themes.push('Творчество');
    return themes.length > 0 ? themes : ['Общий прогноз', 'Личностный рост'];
  };

  return (
    <section className="relative bg-card border border-border rounded-lg overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 left-8">
          <svg width="120" height="120" viewBox="0 0 120 120" className="text-primary">
            <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="60" cy="20" r="4" fill="currentColor"/>
            <circle cx="60" cy="100" r="4" fill="currentColor"/>
            <circle cx="20" cy="60" r="4" fill="currentColor"/>
            <circle cx="100" cy="60" r="4" fill="currentColor"/>
            <circle cx="85" cy="35" r="3" fill="currentColor"/>
            <circle cx="35" cy="85" r="3" fill="currentColor"/>
            <circle cx="35" cy="35" r="3" fill="currentColor"/>
            <circle cx="85" cy="85" r="3" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute bottom-8 right-8">
          <svg width="80" height="80" viewBox="0 0 80 80" className="text-accent">
            <rect x="10" y="10" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" rx="4"/>
            <rect x="20" y="20" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" rx="2"/>
            <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 px-8 py-12 lg:px-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Main heading */}
          <div className="text-center space-y-8 mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight">
                <span className="text-foreground">Астрология и Таро с </span>
                <span 
                  className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text"
                  style={{
                    textShadow: "0 0 20px rgba(155, 140, 255, 0.5)"
                  }}
                >
                  искусственным интеллектом
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto">
                Персональный прогноз на основе точных астрономических расчётов и анализа ИИ
              </p>
            </div>

            {/* Scientific badges */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Swiss Ephemeris</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">NASA JPL Data</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <BrainCog className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">AI Analysis</span>
              </div>
            </div>
          </div>

          {/* Content based on current step */}
          {step === 'form' && (
            <div className="max-w-2xl mx-auto">
              <NatalForm 
                onSubmit={handleFormSubmit}
                isLoading={false}
              />
            </div>
          )}

          {step === 'loading' && (
            <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-br from-card via-card to-card/50">
              <CardContent className="flex items-center justify-center min-h-96">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <Sparkles className="w-8 h-8 text-accent absolute top-6 left-1/2 transform -translate-x-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-heading text-foreground">Рассчитываем вашу натальную карту</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>✨ Определяем позиции планет на момент рождения</p>
                      <p>🌟 Анализируем астрологические аспекты</p>
                      <p>🤖 Генерируем персональный прогноз с помощью ИИ</p>
                    </div>
                  </div>
                  
                  {natalData && (
                    <div className="text-sm text-muted-foreground mt-6">
                      Обрабатываем данные для {natalData.name || 'Anonymous'}<br/>
                      {natalData.birthDate} • {natalData.birthPlace}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'result' && apiResponse && (
            <div className="space-y-8">
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleStartOver}
                  className="mb-8"
                >
                  ← Рассчитать новый прогноз
                </Button>
              </div>
              
              <NatalChart
                {...transformApiData(apiResponse)!}
                isFullUnlocked={isFullUnlocked}
                onPurchase={handlePurchase}
              />
            </div>
          )}

          {/* Error state */}
          {error && (
            <Card className="max-w-md mx-auto border-destructive/50 bg-destructive/10 mt-8">
              <CardContent className="flex items-center space-x-3 pt-6">
                <Ghost className="w-5 h-5 text-destructive" />
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeroSection;