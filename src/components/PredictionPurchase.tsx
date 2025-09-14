"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Shield, 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  Calendar,
  Clock,
  Globe,
  Sparkles,
  Brain,
  Eye,
  Lock,
  Users,
  TrendingUp,
  Heart
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  popular?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period?: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  badge?: string;
}

interface PredictionPurchaseProps {
  onPurchaseComplete: (purchaseData: any) => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Банковская карта",
    icon: <CreditCard className="w-5 h-5" />,
    description: "Visa, MasterCard, МИР",
    popular: true
  },
  {
    id: "sbp",
    name: "СБП",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Система быстрых платежей"
  },
  {
    id: "yoomoney",
    name: "ЮMoney",
    icon: <Banknote className="w-5 h-5" />,
    description: "Электронный кошелёк"
  }
];

const pricingPlans: PricingPlan[] = [
  {
    id: "single",
    name: "Разовый прогноз",
    price: 299,
    currency: "₽",
    features: [
      "Полная натальная карта",
      "Детальный анализ планет",
      "Расчёт всех аспектов",
      "Персональные рекомендации",
      "Научные источники данных"
    ],
    icon: <Eye className="w-6 h-6" />
  },
  {
    id: "premium",
    name: "Премиум подписка",
    price: 999,
    originalPrice: 1299,
    currency: "₽",
    period: "месяц",
    features: [
      "Безлимитные натальные карты",
      "Транзиты и прогрессии",
      "Совместимость партнёров",
      "История всех прогнозов",
      "Персональный AI-астролог",
      "Приоритетная поддержка",
      "Эксклюзивные техники",
      "Экспорт данных"
    ],
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    badge: "Лучшее предложение"
  }
];

const PredictionPurchase: React.FC<PredictionPurchaseProps> = ({ 
  onPurchaseComplete 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handlePurchase = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const purchaseData = {
        planId: selectedPlan,
        paymentMethod: selectedPayment,
        amount: pricingPlans.find(p => p.id === selectedPlan)?.price,
        timestamp: new Date().toISOString()
      };

      onPurchaseComplete(purchaseData);
      setShowPaymentDialog(false);
      toast.success("Оплата прошла успешно! Добро пожаловать в мир персональной астрологии!");
      
    } catch (error) {
      toast.error("Ошибка при обработке платежа. Попробуйте снова.");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPlan, selectedPayment, onPurchaseComplete]);

  const selectedPlanData = pricingPlans.find(p => p.id === selectedPlan);
  const selectedPaymentData = paymentMethods.find(p => p.id === selectedPayment);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-heading font-bold text-foreground">
            Персональные прогнозы
          </h2>
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Получите глубокий анализ вашей натальной карты, основанный на точных астрономических данных 
          и передовых алгоритмах искусственного интеллекта
        </p>

        {/* Scientific credibility badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Globe className="w-4 h-4 mr-2" />
            Swiss Ephemeris DE431
          </Badge>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <Zap className="w-4 h-4 mr-2" />
            NASA JPL Data
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Brain className="w-4 h-4 mr-2" />
            AI Астрологический анализ
          </Badge>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedPlan === plan.id 
                ? "ring-2 ring-primary shadow-lg shadow-primary/20 bg-gradient-to-br from-card via-card to-primary/5" 
                : "hover:border-primary/30 bg-gradient-to-br from-card via-card to-card/50"
            } ${plan.popular ? "scale-105" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold px-4 py-1">
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                {plan.icon}
              </div>
              
              <div>
                <CardTitle className="text-xl font-heading text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="flex items-center justify-center gap-2">
                  {plan.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {plan.originalPrice} {plan.currency}
                    </span>
                  )}
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {plan.price} {plan.currency}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">/ {plan.period}</span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedPlan === plan.id && (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Выбрано</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What You Get Section */}
      <Card className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-heading text-center text-foreground flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-accent" />
            Что вы получите
            <Star className="w-6 h-6 text-accent" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Точные расчёты</h4>
              <p className="text-sm text-muted-foreground">
                Эфемериды Swiss Ephemeris и данные NASA JPL
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-medium text-foreground">ИИ-анализ</h4>
              <p className="text-sm text-muted-foreground">
                Глубокий анализ с помощью нейросетей
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Персонализация</h4>
              <p className="text-sm text-muted-foreground">
                Индивидуальные рекомендации и прогнозы
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-medium text-foreground">Развитие</h4>
              <p className="text-sm text-muted-foreground">
                Пути роста и самопознания
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Button */}
      <div className="text-center">
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-3" />
              Получить {selectedPlanData?.name}
              <Crown className="w-5 h-5 ml-3" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-heading">
                Оформление заказа
              </DialogTitle>
              <DialogDescription className="text-center">
                Выберите способ оплаты для получения полного прогноза
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Plan Summary */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedPlanData?.icon}
                      <div>
                        <div className="font-medium text-foreground">
                          {selectedPlanData?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPlanData?.period ? `За ${selectedPlanData.period}` : 'Разовая покупка'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {selectedPlanData?.price} {selectedPlanData?.currency}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Способ оплаты:</h4>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        {method.icon}
                        <div className="flex-1">
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {method.name}
                            {method.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Популярно
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                        {selectedPayment === method.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-accent" />
                <span>Безопасная оплата • SSL-шифрование</span>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Обрабатываем платёж...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {selectedPaymentData?.icon}
                    <span>Оплатить {selectedPlanData?.price} {selectedPlanData?.currency}</span>
                  </div>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials */}
      <Card className="bg-gradient-to-br from-card via-card to-card/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-heading text-center text-foreground">
            Отзывы пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Невероятно точный анализ! Многие моменты попали прямо в точку."
              </p>
              <div className="text-xs text-muted-foreground">— Елена, 29 лет</div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Научный подход к астрологии — именно то, что я искал!"
              </p>
              <div className="text-xs text-muted-foreground">— Михаил, 34 года</div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Прогнозы помогли мне лучше понять себя и принять важные решения."
              </p>
              <div className="text-xs text-muted-foreground">— Анна, 27 лет</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionPurchase;