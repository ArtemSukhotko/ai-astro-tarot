import React from 'react';
import { Copyright, Hospital, Briefcase } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'СБП', icon: '⚡' },
    { name: 'YooMoney', icon: '💰' }
  ];

  const socialLinks = [
    { name: 'Telegram', icon: '📱', href: '#' },
    { name: 'VK', icon: '🔵', href: '#' }
  ];

  const legalLinks = [
    { name: 'Политика конфиденциальности', href: '/privacy' },
    { name: 'Условия использования', href: '/terms' },
    { name: 'Поддержка', href: '/support' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="font-heading font-semibold text-foreground">
              Астрология & ИИ
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Инновационный сервис персональных прогнозов, объединяющий древние знания астрологии с современными технологиями искусственного интеллекта.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Контакт:</span>
              <a 
                href="mailto:support@astro-ai.ru" 
                className="text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm"
              >
                support@astro-ai.ru
              </a>
            </div>
          </div>

          {/* Payment & Social */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground">
              Способы оплаты
            </div>
            <div className="flex flex-wrap gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted rounded-md text-xs text-muted-foreground"
                >
                  <span>{method.icon}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                Социальные сети
              </div>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <span>{social.icon}</span>
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground">
              Информация
            </div>
            <div className="space-y-2">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-6 mb-6">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex gap-2 text-muted-foreground mt-0.5">
              <Hospital className="h-4 w-4 flex-shrink-0" />
              <Briefcase className="h-4 w-4 flex-shrink-0" />
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong>Важное предупреждение:</strong> Наш сервис предоставляет развлекательный контент и не является медицинской, юридической или финансовой консультацией. Астрологические прогнозы носят исключительно информационный характер. Для решения серьёзных вопросов обращайтесь к квалифицированным специалистам.
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Copyright className="h-3.5 w-3.5" />
              <span>{currentYear} Астрология & ИИ. Все права защищены.</span>
            </div>
            <div className="text-center md:text-right">
              <span>Сделано с ❤️ для познания будущего</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}