"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Clock1, 
  MailCheck, 
  Linkedin, 
  CircleX, 
  CornerUpLeft,
  FileImage,
  MessageSquareReply,
  MailWarning,
  Fullscreen
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  subscriptionStatus: "free" | "premium" | "pro";
  subscriptionExpiry?: string;
}

interface Prediction {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  fullContent: string;
  accessType: "preview" | "full";
  price: number;
  status: "available" | "expired";
}

interface PersonalCabinetProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const mockUser: User = {
  id: "1",
  name: "Александр Новиков",
  email: "alex.novikov@example.com",
  registrationDate: "2024-01-15",
  subscriptionStatus: "premium",
  subscriptionExpiry: "2024-12-15"
};

const mockPredictions: Prediction[] = [
  {
    id: "1",
    title: "Карьерный прорыв в ноябре",
    date: "2024-11-01",
    excerpt: "Звезды указывают на значительные изменения в профессиональной сфере. Венера в соединении с Юпитером...",
    fullContent: "Звезды указывают на значительные изменения в профессиональной сфере. Венера в соединении с Юпитером создает благоприятные аспекты для карьерного роста. В период с 15 по 25 ноября вас ожидают важные деловые предложения. Рекомендуется проявить инициативу в переговорах и не бояться брать на себя дополнительные обязательства.",
    accessType: "full",
    price: 499,
    status: "available"
  },
  {
    id: "2",
    title: "Любовный гороскоп на декабрь",
    date: "2024-10-28",
    excerpt: "Марс входит в знак Рыб, что обещает романтические встречи и глубокие эмоциональные переживания...",
    fullContent: "Марс входит в знак Рыб, что обещает романтические встречи и глубокие эмоциональные переживания. Для одиноких людей это время знакомств с потенциальными партнерами. Семейным парам рекомендуется больше времени проводить вместе и открыто обсуждать свои чувства.",
    accessType: "preview",
    price: 399,
    status: "available"
  },
  {
    id: "3",
    title: "Финансовый прогноз 2024",
    date: "2024-10-20",
    excerpt: "Сатурн в транзите через ваш дом денег указывает на необходимость пересмотреть финансовую стратегию...",
    fullContent: "Сатурн в транзите через ваш дом денег указывает на необходимость пересмотреть финансовую стратегию. Период благоприятен для долгосрочных инвестиций и накоплений. Избегайте импульсивных трат в первой половине месяца.",
    accessType: "full",
    price: 699,
    status: "available"
  }
];

export default function PersonalCabinet({ isOpen, onClose, isMobile = false }: PersonalCabinetProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    historyVisible: false,
    emailNotifications: true
  });

  useEffect(() => {
    // Проверяем локальное хранилище на наличие пользователя
    const savedUser = localStorage.getItem("astro-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setPredictions(mockPredictions);
    }
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (authMode === "login") {
      if (email && password) {
        setUser(mockUser);
        setIsAuthenticated(true);
        setPredictions(mockPredictions);
        localStorage.setItem("astro-user", JSON.stringify(mockUser));
        toast.success("Добро пожаловать!");
      } else {
        toast.error("Заполните все поля");
      }
    } else {
      if (email && password && name) {
        const newUser = {
          ...mockUser,
          name,
          email,
          registrationDate: new Date().toISOString().split('T')[0]
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("astro-user", JSON.stringify(newUser));
        toast.success("Регистрация успешна!");
      } else {
        toast.error("Заполните все поля");
      }
    }
    
    setLoading(false);
  };

  const handleSocialAuth = (provider: string) => {
    toast.success(`Вход через ${provider} в разработке`);
  };

  const handleMagicLink = () => {
    if (!email) {
      toast.error("Введите email");
      return;
    }
    toast.success("Ссылка для входа отправлена на email");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPredictions([]);
    localStorage.removeItem("astro-user");
    toast.success("Вы вышли из аккаунта");
  };

  const openPrediction = (prediction: Prediction) => {
    if (prediction.accessType === "full") {
      setSelectedPrediction(prediction);
      setShowPredictionModal(true);
    } else {
      toast.error("Требуется покупка полной версии");
    }
  };

  const reorderPrediction = (prediction: Prediction) => {
    toast.success(`Заказ прогноза "${prediction.title}" оформлен`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Текст скопирован");
  };

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case "premium": return "bg-accent text-accent-foreground";
      case "pro": return "bg-primary text-primary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const AuthForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading font-bold">
          {authMode === "login" ? "Вход в аккаунт" : "Регистрация"}
        </h2>
        <p className="text-muted-foreground">
          {authMode === "login" 
            ? "Получите доступ к своим прогнозам" 
            : "Создайте аккаунт для сохранения истории"
          }
        </p>
      </div>

      <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ваш@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </TabsContent>

        <TabsContent value="register" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ваш@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Пароль</Label>
            <Input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <Button 
          onClick={handleAuth} 
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          style={{ boxShadow: "0 0 20px rgba(255, 232, 155, 0.4)" }}
        >
          {loading ? "Загрузка..." : authMode === "login" ? "Войти" : "Создать аккаунт"}
        </Button>

        <Button
          variant="outline"
          onClick={handleMagicLink}
          className="w-full"
        >
          <MailCheck className="w-4 h-4 mr-2" />
          Войти по ссылке из email
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Или через</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={() => handleSocialAuth("Google")}
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialAuth("LinkedIn")}
          className="w-full"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="border border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
            <Badge className={getSubscriptionColor(user?.subscriptionStatus || "free")}>
              {user?.subscriptionStatus === "premium" ? "Премиум" : 
               user?.subscriptionStatus === "pro" ? "Про" : "Бесплатно"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Дата регистрации</p>
              <p className="font-medium">
                {user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString('ru') : ''}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Подписка до</p>
              <p className="font-medium">
                {user?.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString('ru') : 'Не активна'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>

      {/* History Section */}
      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock1 className="w-5 h-5" />
            История прогнозов
          </CardTitle>
          <CardDescription>
            Ваши сохраненные и купленные предсказания
          </CardDescription>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-muted-foreground">
                <MessageSquareReply className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Пока нет прогнозов</p>
                <p className="text-sm">Получите свой первый персональный прогноз</p>
              </div>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                style={{ boxShadow: "0 0 20px rgba(255, 232, 155, 0.4)" }}
                onClick={onClose}
              >
                Получить прогноз
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border/40 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{prediction.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(prediction.date).toLocaleDateString('ru')}
                      </p>
                    </div>
                    <Badge variant={prediction.accessType === "full" ? "default" : "secondary"}>
                      {prediction.accessType === "full" ? "Полный доступ" : "Превью"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {prediction.excerpt}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={prediction.accessType === "full" ? "default" : "outline"}
                      onClick={() => openPrediction(prediction)}
                      className={prediction.accessType === "full" ? 
                        "bg-primary hover:bg-primary/90" : ""}
                    >
                      <Fullscreen className="w-4 h-4 mr-2" />
                      {prediction.accessType === "full" ? "Открыть" : "Купить полную версию"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reorderPrediction(prediction)}
                    >
                      <CornerUpLeft className="w-4 h-4 mr-2" />
                      Повторить заказ
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle>Управление подпиской</CardTitle>
          <CardDescription>
            Текущий статус и история платежей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div>
              <p className="font-medium">Премиум подписка</p>
              <p className="text-sm text-muted-foreground">
                Активна до {user?.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString('ru') : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">₽999/мес</p>
              <p className="text-xs text-muted-foreground">Следующее списание</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Продлить подписку
            </Button>
            <Button variant="outline" className="flex-1">
              <MailWarning className="w-4 h-4 mr-2" />
              Отменить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle>Настройки приватности</CardTitle>
          <CardDescription>
            Управление видимостью данных
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Видимость профиля</p>
              <p className="text-sm text-muted-foreground">Показывать профиль другим пользователям</p>
            </div>
            <Switch
              checked={privacySettings.profileVisible}
              onCheckedChange={(checked) => 
                setPrivacySettings(prev => ({ ...prev, profileVisible: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">История прогнозов</p>
              <p className="text-sm text-muted-foreground">Сохранять историю заказов</p>
            </div>
            <Switch
              checked={privacySettings.historyVisible}
              onCheckedChange={(checked) => 
                setPrivacySettings(prev => ({ ...prev, historyVisible: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email уведомления</p>
              <p className="text-sm text-muted-foreground">Получать уведомления о новых прогнозах</p>
            </div>
            <Switch
              checked={privacySettings.emailNotifications}
              onCheckedChange={(checked) => 
                setPrivacySettings(prev => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <Button variant="link" className="text-sm text-muted-foreground p-0">
            Политика конфиденциальности
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const PredictionModal = () => (
    <Dialog open={showPredictionModal} onOpenChange={setShowPredictionModal}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{selectedPrediction?.title}</DialogTitle>
          <DialogDescription>
            Прогноз от {selectedPrediction?.date ? new Date(selectedPrediction.date).toLocaleDateString('ru') : ''}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-96">
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">
              {selectedPrediction?.fullContent}
            </p>
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={() => selectedPrediction && copyToClipboard(selectedPrediction.fullContent)}
            variant="outline"
            className="flex-1"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Копировать текст
          </Button>
          <Button 
            onClick={() => setShowPredictionModal(false)}
            variant="outline"
          >
            <CircleX className="w-4 h-4 mr-2" />
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const content = (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AuthForm />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <PredictionModal />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader className="border-b border-border/60">
            <DrawerTitle>
              {!isAuthenticated ? "Личный кабинет" : `Добро пожаловать, ${user?.name?.split(' ')[0]}`}
            </DrawerTitle>
            <DrawerDescription>
              {!isAuthenticated ? "Войдите для доступа к истории прогнозов" : "Управление аккаунтом и подпиской"}
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {!isAuthenticated ? "Личный кабинет" : `Добро пожаловать, ${user?.name?.split(' ')[0]}`}
          </DialogTitle>
          <DialogDescription>
            {!isAuthenticated ? "Войдите для доступа к истории прогнозов" : "Управление аккаунтом и подпиской"}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}