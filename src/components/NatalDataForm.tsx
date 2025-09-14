"use client";

import React, { useState, useCallback } from 'react';
import { CosmicBackground } from '@/components/ui/CosmicBackground';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Sparkles, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NatalData {
  name?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
}

interface NatalFormProps {
  onSubmit: (data: NatalData) => void;
  isLoading?: boolean;
  className?: string;
}

export const NatalForm: React.FC<NatalFormProps> = ({
  onSubmit,
  isLoading = false,
  className
}) => {
  const [formData, setFormData] = useState<Partial<NatalData>>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof NatalData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof NatalData, string>> = {};

    if (!formData.birthDate) {
      newErrors.birthDate = "Дата рождения необходима для расчёта астрологических позиций";
    }

    if (!formData.birthPlace) {
      newErrors.birthPlace = "Место рождения определяет координаты для точных вычислений";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: NatalData = {
      birthDate: formData.birthDate!,
      birthPlace: formData.birthPlace!,
      ...(formData.name && { name: formData.name }),
      ...(formData.birthTime && { birthTime: formData.birthTime })
    };

    onSubmit(submitData);
  }, [formData, validateForm, onSubmit]);

  const handleFieldChange = useCallback((field: keyof NatalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <div className={cn("relative", className)}>
      <CosmicBackground />

      <Card className="relative border-primary/20 bg-gradient-to-br from-card/90 via-card/95 to-sidebar/90 backdrop-blur-sm shadow-2xl shadow-primary/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
          </div>
          
          <CardTitle className="text-2xl font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Данные для натальной карты
          </CardTitle>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2 border border-primary/10">
            <Zap className="w-4 h-4 text-accent" />
            <span>Для точного расчёта натальной карты необходимы астрономически точные данные</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary" />
                Имя (необязательно)
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя (необязательно)"
                  autoComplete="name"
                  value={formData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300",
                    focusedField === 'name' && "shadow-lg shadow-primary/10 bg-input/70"
                  )}
                />
                {focusedField === 'name' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10 animate-pulse" />
                )}
              </div>
            </div>

            {/* Birth Date Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="birthDate" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-primary" />
                Дата рождения *
              </Label>
              <div className="relative">
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate || ''}
                  autoComplete="off"
                  onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                  onFocus={() => setFocusedField('birthDate')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300",
                    focusedField === 'birthDate' && "shadow-lg shadow-primary/10 bg-input/70",
                    errors.birthDate && "border-destructive/50 focus:border-destructive/70"
                  )}
                />
                {focusedField === 'birthDate' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10 animate-pulse" />
                )}
              </div>
              {errors.birthDate && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {errors.birthDate}
                </p>
              )}
            </div>

            {/* Birth Time Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="birthTime" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-primary" />
                Время рождения
              </Label>
              <div className="relative">
                <Input
                  id="birthTime"
                  type="time"
                  placeholder="Время рождения (по возможности)"
                  value={formData.birthTime || ''}
                  autoComplete="off"
                  onChange={(e) => handleFieldChange('birthTime', e.target.value)}
                  onFocus={() => setFocusedField('birthTime')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300",
                    focusedField === 'birthTime' && "shadow-lg shadow-primary/10 bg-input/70"
                  )}
                />
                {focusedField === 'birthTime' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Точное время повышает точность астрологических расчётов
              </p>
            </div>

            {/* Birth Place Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="birthPlace" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-primary" />
                Место рождения *
              </Label>
              <div className="relative">
                <Input
                  id="birthPlace"
                  type="text"
                  placeholder="Место рождения (город)"
                  value={formData.birthPlace || ''}
                  autoComplete="off"
                  onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
                  onFocus={() => setFocusedField('birthPlace')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    "bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300",
                    focusedField === 'birthPlace' && "shadow-lg shadow-primary/10 bg-input/70",
                    errors.birthPlace && "border-destructive/50 focus:border-destructive/70"
                  )}
                />
                {focusedField === 'birthPlace' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10 animate-pulse" />
                )}
              </div>
              {errors.birthPlace && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {errors.birthPlace}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-heading font-semibold py-6 text-lg",
                "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300",
                "border border-primary/20 hover:border-primary/40",
                "relative overflow-hidden group",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Обрабатываем космические данные...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 relative z-10">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Рассчитать мой прогноз</span>
                  <Star className="w-5 h-5 animate-pulse" />
                </div>
              )}
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
            </Button>
          </form>

          {/* Decorative elements */}
          <div className="flex justify-center items-center gap-4 pt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary/30 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};