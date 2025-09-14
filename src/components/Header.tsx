"use client";

import { useState, useCallback } from "react";
import { LogIn, SquareMenu, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { name: "Главная", href: "#hero" },
    { name: "Научная база", href: "#science" },
    { name: "Таро", href: "#tarot" },
    { name: "Предсказание", href: "#prediction" },
    { name: "Контакты", href: "#contacts" },
  ];

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  }, []);

  const handleGetFreeReading = useCallback(() => {
    scrollToSection("#hero");
    // Focus on the form in hero section after a short delay
    setTimeout(() => {
      const form = document.querySelector("#hero form");
      if (form) {
        (form as HTMLElement).focus();
      }
    }, 500);
  }, [scrollToSection]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful authentication
      const mockUser: User = {
        name: "Анна Звездная",
        email: email,
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face`
      };
      
      setUser(mockUser);
      setIsAuthModalOpen(false);
      toast.success("Добро пожаловать! Вы успешно вошли в систему.");
      
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Ошибка входа. Проверьте данные и попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        name: provider === "vk" ? "Пользователь VK" : "Пользователь Google",
        email: `user@${provider}.com`,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face`
      };
      
      setUser(mockUser);
      setIsAuthModalOpen(false);
      toast.success(`Вход через ${provider.toUpperCase()} выполнен успешно!`);
    } catch (error) {
      toast.error("Ошибка социальной авторизации.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileMenuOpen(false);
    toast.success("Вы успешно вышли из системы.");
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border border-accent rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-heading font-bold text-foreground">
          AstroAI
        </span>
        <span className="text-xs text-muted-foreground -mt-1">
          Космический прогноз
        </span>
      </div>
    </div>
  );

  const AuthModal = () => (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-center">
            {authMode === "login" ? "Вход в систему" : "Регистрация"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center space-x-2 border-border hover:bg-muted"
              onClick={() => handleSocialAuth("vk")}
              disabled={isLoading}
            >
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span>Войти через VK</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-center space-x-2 border-border hover:bg-muted"
              onClick={() => handleSocialAuth("google")}
              disabled={isLoading}
            >
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span>Войти через Google</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Загрузка...</span>
                </div>
              ) : (
                authMode === "login" ? "Войти" : "Создать аккаунт"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="text-sm text-primary hover:underline"
            >
              {authMode === "login"
                ? "Нет аккаунта? Зарегистрируйтесь"
                : "Уже есть аккаунт? Войдите"
              }
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const UserProfile = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center space-x-2 hover:bg-muted/50"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">
              {user?.name.charAt(0)}
            </span>
          </div>
        )}
        <span className="hidden sm:inline text-sm">{user?.name}</span>
      </Button>

      {isProfileMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="p-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setIsProfileMenuOpen(false);
                toast.info("Переход в личный кабинет...");
              }}
            >
              Личный кабинет
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200 hover:shadow-[0_0_8px_var(--color-primary)] hover:text-shadow-sm"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Get Free Reading Button */}
              <Button
                onClick={handleGetFreeReading}
                className="hidden sm:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-[0_0_12px_var(--color-accent)] hover:shadow-[0_0_16px_var(--color-accent)] border border-accent/30"
              >
                Получить бесплатный прогноз
              </Button>

              {/* Auth Section */}
              {user ? (
                <UserProfile />
              ) : (
                <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-muted/50"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Войти</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                  >
                    <SquareMenu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-card border-border">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>
                  
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.href)}
                        className="text-left py-2 text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </button>
                    ))}
                    
                    <div className="pt-4 border-t border-border">
                      <Button
                        onClick={handleGetFreeReading}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-[0_0_12px_var(--color-accent)]"
                      >
                        Получить бесплатный прогноз
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
}