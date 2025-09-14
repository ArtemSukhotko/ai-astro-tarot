"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Globe, 
  Telescope, 
  Calculator, 
  Zap, 
  TrendingUp, 
  Orbit,
  Satellite,
  Database,
  Cpu,
  Star,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Atom
} from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const ScientificBasis = () => {
  const [activeDataset, setActiveDataset] = useState('ephemeris');
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues({
        calculations: Math.floor(Math.random() * 100) + 1200,
        accuracy: Math.random() * 5 + 95,
        processing: Math.random() * 200 + 800,
        ephemeris: Math.random() * 50 + 450
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const ephemerisData: DataPoint[] = [
    { label: "Солнце", value: 99.99, color: "#FFD700" },
    { label: "Луна", value: 99.95, color: "#C0C0C0" },
    { label: "Меркурий", value: 99.92, color: "#FFA500" },
    { label: "Венера", value: 99.97, color: "#32CD32" },
    { label: "Марс", value: 99.89, color: "#FF4500" },
    { label: "Юпитер", value: 99.85, color: "#4169E1" },
    { label: "Сатурн", value: 99.91, color: "#8B4513" },
    { label: "Уран", value: 99.78, color: "#00CED1" },
    { label: "Нептун", value: 99.82, color: "#4B0082" },
    { label: "Плутон", value: 99.74, color: "#8B0000" }
  ];

  const processingMetrics: DataPoint[] = [
    { label: "Позиции планет", value: 85, color: "#9B8CFF" },
    { label: "Аспекты", value: 72, color: "#FFE89B" },
    { label: "Дома", value: 68, color: "#9B8CFF" },
    { label: "Интерпретация", value: 91, color: "#FFE89B" }
  ];

  const accuracyData: DataPoint[] = [
    { label: "Положение Солнца", value: 99.9, color: "#FFD700" },
    { label: "Лунные фазы", value: 99.8, color: "#C0C0C0" },
    { label: "Планетарные аспекты", value: 98.5, color: "#9B8CFF" },
    { label: "Домные позиции", value: 97.2, color: "#FFE89B" }
  ];

  const metrics: MetricCard[] = [
    {
      title: "Расчёты в день",
      value: `${animatedValues.calculations || 1247}`,
      change: "+12.5%",
      icon: <Calculator className="w-5 h-5" />,
      color: "text-primary"
    },
    {
      title: "Точность данных",
      value: `${(animatedValues.accuracy || 96.8).toFixed(1)}%`,
      change: "+0.3%",
      icon: <Telescope className="w-5 h-5" />,
      color: "text-accent"
    },
    {
      title: "Время обработки",
      value: `${animatedValues.processing || 892}ms`,
      change: "-5.2%",
      icon: <Zap className="w-5 h-5" />,
      color: "text-primary"
    },
    {
      title: "Точек эфемерид",
      value: `${animatedValues.ephemeris || 468}K`,
      change: "+2.1%",
      icon: <Database className="w-5 h-5" />,
      color: "text-accent"
    }
  ];

  const renderBarChart = (data: DataPoint[]) => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{item.label}</span>
            <span className="text-muted-foreground">{item.value}%</span>
          </div>
          <div className="w-full bg-secondary/30 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
                boxShadow: `0 0 10px ${item.color}40`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = (data: DataPoint[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg width="192" height="192" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (item.value / total) * 360;
              const radius = 70;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
              const strokeDashoffset = -((currentAngle / 360) * circumference);
              
              currentAngle += angle;
              
              return (
                <circle
                  key={index}
                  cx="96"
                  cy="96"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 8px ${item.color}40)`
                  }}
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {data.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Компонентов
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-8 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render current dataset content based on active tab
  const renderDatasetContent = () => {
    switch (activeDataset) {
      case 'ephemeris':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              Точность планетарных позиций
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              Процент точности вычисления позиций планет на основе эфемерид Swiss Ephemeris DE431
            </p>
            {renderBarChart(ephemerisData)}
          </div>
        );
      case 'processing':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Этапы обработки данных
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              Распределение вычислительных ресурсов по компонентам анализа натальной карты
            </p>
            {renderPieChart(processingMetrics)}
          </div>
        );
      case 'accuracy':
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Достоверность расчётов
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              Статистическая точность различных компонентов астрологического анализа
            </p>
            {renderBarChart(accuracyData)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Telescope className="w-8 h-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Научная основа
            </span>
          </h2>
          <Brain className="w-8 h-8 text-accent" />
        </div>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Наши прогнозы создаются на основе точных астрономических данных NASA и передовых 
          алгоритмов машинного обучения, обеспечивая максимальную научную достоверность
        </p>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-primary/10 ${metric.color}`}>
                  {metric.icon}
                </div>
                <Badge variant="secondary" className={`${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} bg-transparent border-none text-xs`}>
                  {metric.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.title}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Satellite className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">Swiss Ephemeris</CardTitle>
            </div>
            <CardDescription>
              Высокоточные астрономические данные
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Точность позиций:</span>
                <span className="text-foreground font-medium">0.001"</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Временной охват:</span>
                <span className="text-foreground font-medium">13000 лет</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Объектов:</span>
                <span className="text-foreground font-medium">10+ планет</span>
              </div>
            </div>
            <Badge variant="secondary" className="w-full justify-center bg-primary/10 text-primary border-primary/20">
              <Atom className="w-4 h-4 mr-2" />
              Научный стандарт
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card via-card to-card/50 border-accent/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-accent" />
              <CardTitle className="text-lg">NASA JPL</CardTitle>
            </div>
            <CardDescription>
              Данные Лаборатории реактивного движения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Обновления:</span>
                <span className="text-foreground font-medium">Ежедневно</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Источник:</span>
                <span className="text-foreground font-medium">DE431</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Охват:</span>
                <span className="text-foreground font-medium">1550-2650</span>
              </div>
            </div>
            <Badge variant="secondary" className="w-full justify-center bg-accent/10 text-accent border-accent/20">
              <Telescope className="w-4 h-4 mr-2" />
              Космическая точность
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">ИИ-анализ</CardTitle>
            </div>
            <CardDescription>
              Машинное обучение и нейросети
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Алгоритмов:</span>
                <span className="text-foreground font-medium">50+ моделей</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Обучение:</span>
                <span className="text-foreground font-medium">1M+ карт</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Точность:</span>
                <span className="text-foreground font-medium">96.8%</span>
              </div>
            </div>
            <Badge variant="secondary" className="w-full justify-center bg-primary/10 text-primary border-primary/20">
              <Brain className="w-4 h-4 mr-2" />
              Умные прогнозы
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Data Visualization */}
      <Card className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-accent" />
              <CardTitle className="text-xl">Аналитика данных</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-secondary/50 rounded-lg p-1">
              <button
                onClick={() => setActiveDataset('ephemeris')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeDataset === 'ephemeris'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Эфемериды
              </button>
              <button
                onClick={() => setActiveDataset('processing')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeDataset === 'processing'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Обработка
              </button>
              <button
                onClick={() => setActiveDataset('accuracy')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeDataset === 'accuracy'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Точность
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {renderDatasetContent()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scientific Process */}
      <Card className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <Orbit className="w-6 h-6 text-primary" />
            Процесс создания прогноза
          </CardTitle>
          <CardDescription>
            Пошаговый научный подход к анализу натальной карты
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Сбор данных</h4>
                <p className="text-sm text-muted-foreground">
                  Получение точных координат времени и места рождения
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Расчёт позиций</h4>
                <p className="text-sm text-muted-foreground">
                  Вычисление положений планет с помощью Swiss Ephemeris
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Анализ аспектов</h4>
                <p className="text-sm text-muted-foreground">
                  Определение взаимодействий между планетами
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-accent">4</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">ИИ-интерпретация</h4>
                <p className="text-sm text-muted-foreground">
                  Генерация персонального прогноза с помощью нейросетей
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-heading font-bold text-foreground">
            Готовы получить научно обоснованный прогноз?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Попробуйте нашу систему персонализированного астрологического анализа, 
            основанную на точных астрономических данных и алгоритмах ИИ
          </p>
        </div>
        
        <Button
          size="lg"
          onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transform hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 mr-3" />
          Рассчитать мою натальную карту
          <TrendingUp className="w-5 h-5 ml-3" />
        </Button>
      </div>
    </div>
  );
};

export default ScientificBasis;