"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Circle, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  Zap,
  Globe,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  retrograde?: boolean;
}

interface House {
  number: number;
  sign: string;
  degree: number;
  ruler: string;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  strength: number;
  description: string;
}

interface NatalChart {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  signs: string[];
  ascendant: string;
  midheaven: string;
}

interface Prediction {
  preview: string;
  full: string;
  keyThemes: string[];
  confidence: number;
}

interface Metadata {
  calculatedAt: string;
  ephemerisSource: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
  nasaReference: string;
}

interface NatalChartProps {
  natalChart: NatalChart;
  prediction: Prediction;
  metadata: Metadata;
  isFullUnlocked: boolean;
  onPurchase: () => void;
  className?: string;
}

const planetColors: Record<string, string> = {
  Sun: "#FFD700",
  Moon: "#C0C0C0",
  Mercury: "#FFA500",
  Venus: "#32CD32",
  Mars: "#FF4500",
  Jupiter: "#4169E1",
  Saturn: "#8B4513",
  Uranus: "#00CED1",
  Neptune: "#4B0082",
  Pluto: "#8B0000"
};

const aspectColors: Record<string, string> = {
  conjunction: "#FFD700",
  opposition: "#FF4500",
  trine: "#32CD32",
  square: "#FF6347",
  sextile: "#87CEEB",
  quincunx: "#DDA0DD"
};

export const NatalChart: React.FC<NatalChartProps> = ({
  natalChart,
  prediction,
  metadata,
  isFullUnlocked,
  onPurchase,
  className = ""
}) => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"wheel" | "table">("wheel");
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [expandedAspect, setExpandedAspect] = useState<number | null>(null);
  const [showFullPrediction, setShowFullPrediction] = useState(false);

  // Structured renderer for prediction text
  const StructuredText: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listBuffer: React.ReactNode[] = [];
    let listType: "ol" | "ul" | null = null;

    const flushList = () => {
      if (listBuffer.length && listType) {
        elements.push(
          listType === "ol" ? (
            <ol key={`ol-${elements.length}`} className="list-decimal pl-6 space-y-1">
              {listBuffer}
            </ol>
          ) : (
            <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-1">
              {listBuffer}
            </ul>
          )
        );
      }
      listBuffer = [];
      listType = null;
    };

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      if (!line) {
        flushList();
        return;
      }

      // Ordered list item (e.g., "1. text")
      if (/^\d+\.\s+/.test(line)) {
        const content = line.replace(/^\d+\.\s+/, "");
        if (listType !== "ol") flushList();
        listType = "ol";
        listBuffer.push(
          <li key={`li-${idx}`} className="text-muted-foreground">
            {content}
          </li>
        );
        return;
      }

      // Unordered list item (e.g., "• text")
      if (/^[•\-]\s+/.test(line)) {
        const content = line.replace(/^[•\-]\s+/, "");
        if (listType !== "ul") flushList();
        listType = "ul";
        listBuffer.push(
          <li key={`li-${idx}`} className="text-muted-foreground">
            {content}
          </li>
        );
        return;
      }

      // Uppercase heading lines
      const isUpper = line === line.toUpperCase() && /[А-ЯA-Z]/.test(line);
      if (isUpper || /:$/u.test(line)) {
        flushList();
        elements.push(
          <h4 key={`h-${idx}`} className="text-foreground font-heading font-semibold mt-4 mb-2">
            {line.replace(/:$/u, "")}
          </h4>
        );
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${idx}`} className="text-muted-foreground leading-relaxed mb-3">
          {line}
        </p>
      );
    });

    flushList();
    return <div className="space-y-1">{elements}</div>;
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderPlanetWheel = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    return (
      <div className="relative w-80 h-80 mx-auto">
        <svg width="300" height="300" className="absolute inset-0">
          {/* Outer circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 20}
            fill="none"
            stroke="rgba(155, 140, 255, 0.3)"
            strokeWidth="2"
            className="animate-pulse"
          />
          
          {/* Inner circles */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(255, 232, 155, 0.2)"
            strokeWidth="1"
          />
          
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 20}
            fill="none"
            stroke="rgba(155, 140, 255, 0.2)"
            strokeWidth="1"
          />

          {/* House divisions */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = centerX + (radius - 20) * Math.cos(angle);
            const y1 = centerY + (radius - 20) * Math.sin(angle);
            const x2 = centerX + (radius + 20) * Math.cos(angle);
            const y2 = centerY + (radius + 20) * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(155, 140, 255, 0.3)"
                strokeWidth="1"
              />
            );
          })}

          {/* Planets */}
          {natalChart.planets.map((planet, index) => {
            const angle = (planet.degree - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const color = planetColors[planet.name] || "#9B8CFF";
            
            return (
              <g key={planet.name}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={color}
                  stroke="#0E0F13"
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPlanet === planet.name ? "animate-pulse scale-125" : ""
                  }`}
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                />
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#0E0F13"
                  className="font-bold select-none"
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}

          {/* Aspects */}
          {natalChart.aspects.slice(0, 5).map((aspect, index) => {
            const planet1 = natalChart.planets.find(p => p.name === aspect.planet1);
            const planet2 = natalChart.planets.find(p => p.name === aspect.planet2);
            
            if (!planet1 || !planet2) return null;
            
            const angle1 = (planet1.degree - 90) * (Math.PI / 180);
            const angle2 = (planet2.degree - 90) * (Math.PI / 180);
            const x1 = centerX + radius * Math.cos(angle1);
            const y1 = centerY + radius * Math.sin(angle1);
            const x2 = centerX + radius * Math.cos(angle2);
            const y2 = centerY + radius * Math.sin(angle2);
            
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={aspectColors[aspect.type] || "#9B8CFF"}
                strokeWidth="1"
                strokeOpacity="0.6"
                strokeDasharray={aspect.type === "opposition" ? "4,4" : "none"}
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Cosmic background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        <Card className="p-8 bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="relative">
                <Circle className="w-16 h-16 text-primary animate-spin mx-auto" />
                <Sparkles className="w-8 h-8 text-accent absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-heading text-foreground">Вычисление натальной карты</h3>
                <p className="text-muted-foreground">Анализируем позиции планет и аспекты...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Chart Header */}
      <Card className="p-6 bg-gradient-to-r from-card via-card to-card/50 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-heading text-foreground">Натальная карта</h2>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-анализ
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Рассчитано:</span>
              <span className="text-foreground">{new Date(metadata.calculatedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Координаты:</span>
              <span className="text-foreground">{metadata.coordinates.lat.toFixed(2)}°, {metadata.coordinates.lng.toFixed(2)}°</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Часовой пояс:</span>
              <span className="text-foreground">{metadata.timezone}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading text-foreground">Планетарное колесо</h3>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "wheel" | "table")}>
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="wheel">Колесо</TabsTrigger>
                <TabsTrigger value="table">Таблица</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeView === "wheel" ? (
            renderPlanetWheel()
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {natalChart.planets.map((planet) => (
                <div
                  key={planet.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-background"
                      style={{ backgroundColor: planetColors[planet.name] || "#9B8CFF" }}
                    >
                      {planet.symbol}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{planet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {planet.sign} • Дом {planet.house}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-foreground">{planet.degree.toFixed(2)}°</div>
                    {planet.retrograde && (
                      <Badge variant="outline" className="text-xs">R</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Aspects */}
        <Card className="p-6 bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
          <h3 className="text-xl font-heading text-foreground mb-6">Аспекты</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {natalChart.aspects.map((aspect, index) => (
              <div key={index} className="border border-border/50 rounded-lg overflow-hidden">
                <div
                  className="p-3 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setExpandedAspect(expandedAspect === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: aspectColors[aspect.type] || "#9B8CFF" }}
                      />
                      <span className="font-medium text-foreground">
                        {aspect.planet1} {aspect.type} {aspect.planet2}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < aspect.strength ? "text-accent fill-accent" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      {expandedAspect === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
                
                {expandedAspect === index && (
                  <div className="px-3 pb-3 text-sm text-muted-foreground border-t border-border/30 bg-secondary/10">
                    <div className="pt-3 space-y-1">
                      <div>Орб: {aspect.orb.toFixed(2)}°</div>
                      <div>{aspect.description}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Prediction Section */}
      <Card className="p-6 bg-gradient-to-br from-card via-card to-card/50 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-heading text-foreground">Персональное предсказание</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
              Точность: {prediction.confidence}%
            </Badge>
            {isFullUnlocked ? (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Unlock className="w-3 h-3 mr-1" />
                Полный доступ
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <Lock className="w-3 h-3 mr-1" />
                Превью
              </Badge>
            )}
          </div>
        </div>

        {/* Key Themes */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Ключевые темы:</h4>
          <div className="flex flex-wrap gap-2">
            {prediction.keyThemes.map((theme, index) => (
              <Badge key={index} variant="outline" className="border-primary/30 text-primary">
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        {/* Prediction Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-foreground leading-relaxed">
            {isFullUnlocked ? (
              <div>
                {showFullPrediction ? (
                  <StructuredText text={prediction.full} />
                ) : (
                  <StructuredText text={prediction.preview} />
                )}
                {!showFullPrediction && prediction.full.length > prediction.preview.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullPrediction(true)}
                    className="mt-3 text-primary hover:text-primary/80"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Показать полное предсказание
                  </Button>
                )}
                {showFullPrediction && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullPrediction(false)}
                    className="mt-3 text-primary hover:text-primary/80"
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Скрыть
                  </Button>
                )}
              </div>
            ) : (
              <div className="relative">
                <div>
                  <StructuredText text={prediction.preview} />
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-foreground">Получите полное предсказание</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Откройте детальный анализ всех аспектов вашей натальной карты и получите персональные рекомендации от ИИ-астролога.
                  </p>
                  <Button onClick={onPurchase} className="bg-primary hover:bg-primary/80 text-primary-foreground">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Открыть полный прогноз
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Metadata */}
      <Card className="p-6 bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
        <h3 className="text-lg font-heading text-foreground mb-4">Источники данных</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Эфемериды:</div>
            <div className="text-foreground font-medium">{metadata.ephemerisSource}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">NASA Reference:</div>
            <div className="text-foreground font-medium font-mono">{metadata.nasaReference}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Все расчёты выполнены с использованием точных астрономических данных NASA и Swiss Ephemeris. 
            Позиции планет вычислены с точностью до секунды дуги.
          </p>
        </div>
      </Card>
    </div>
  );
};