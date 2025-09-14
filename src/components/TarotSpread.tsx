"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice3, CreditCard, CircleX, Spade } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TarotCard {
  id: string;
  name: string;
  image: string;
  shortMeaning: string;
  fullInterpretation: string;
  position?: string;
}

interface Spread {
  id: string;
  name: string;
  cardCount: number;
  positions: string[];
  description: string;
}

const SPREADS: Spread[] = [
  {
    id: "three-card",
    name: "Тройка карт",
    cardCount: 3,
    positions: ["Прошлое", "Настоящее", "Будущее"],
    description: "Краткий расклад для общего понимания ситуации"
  },
  {
    id: "celtic-cross",
    name: "Кельтский крест",
    cardCount: 10,
    positions: [
      "Текущая ситуация", "Препятствие", "Далекое прошлое", "Недавнее прошлое",
      "Возможное будущее", "Ближайшее будущее", "Ваш подход", "Внешние влияния",
      "Надежды и страхи", "Итог"
    ],
    description: "Расширенный расклад для глубокого анализа"
  },
  {
    id: "love",
    name: "Любовный расклад",
    cardCount: 5,
    positions: ["Ваше сердце", "Сердце партнера", "Связь между вами", "Препятствия", "Исход"],
    description: "Тематический расклад для вопросов отношений"
  }
];

const SAMPLE_CARDS: Omit<TarotCard, 'position'>[] = [
  {
    id: "fool",
    name: "Шут",
    image: "https://v3.fal.media/files/tiger/YB-VqqfY74VWySIcIjbzb_output.png",
    shortMeaning: "Новые начинания, спонтанность, доверие к интуиции...",
    fullInterpretation: "Шут символизирует новые возможности и готовность к переменам. Эта карта указывает на важность доверия к интуиции и готовность сделать прыжок веры. В вашей ситуации она говорит о том, что пришло время оставить страхи позади и открыться новому опыту. Это может означать начало нового проекта, отношений или жизненного этапа. Важно помнить, что иногда 'глупость' с точки зрения других является мудростью души."
  },
  {
    id: "magician",
    name: "Маг",
    image: "https://v3.fal.media/files/penguin/gJ0lREye-WxfpFIQ8IJwn_output.png",
    shortMeaning: "Воля, мастерство, возможности, концентрация...",
    fullInterpretation: "Маг представляет силу воли и способность материализовать свои намерения. У вас есть все необходимые инструменты для достижения целей. Эта карта призывает к действию и напоминает о вашей внутренней силе. Сейчас особенно важно сосредоточиться на своих истинных желаниях и направить всю энергию на их воплощение. Маг также символизирует коммуникацию и способность влиять на других через слово и пример."
  },
  {
    id: "high-priestess",
    name: "Верховная Жрица",
    image: "https://v3.fal.media/files/panda/XFOhJJ4u4bV5hOCZgcibp_output.png",
    shortMeaning: "Интуиция, тайные знания, внутренняя мудрость...",
    fullInterpretation: "Верховная Жрица олицетворяет глубокую интуицию и связь с подсознанием. Она призывает вас обратиться к внутренней мудрости и довериться своим инстинктам. В данный момент важнее слушать сердце, чем руководствоваться только логикой. Эта карта может указывать на скрытую информацию, которая вскоре откроется, или на необходимость развивать свои психические способности. Медитация и самоанализ принесут важные озарения."
  },
  {
    id: "emperor",
    name: "Император",
    image: "https://v3.fal.media/files/koala/9wpl0kqz7CMJylov3cjPL_output.png",
    shortMeaning: "Власть, структура, контроль, стабильность...",
    fullInterpretation: "Император символизирует лидерство, власть и структурированный подход к жизни. Эта карта говорит о необходимости взять контроль над ситуацией и проявить решительность. Возможно, пришло время установить четкие границы или принять важное решение. Император также представляет отцовскую энергию - защиту, руководство и ответственность. В деловых вопросах эта карта особенно благоприятна."
  },
  {
    id: "lovers",
    name: "Влюбленные",
    image: "https://v3.fal.media/files/monkey/KiXRFuF8AZKmHtBH9wGRk_output.png",
    shortMeaning: "Любовь, выбор, гармония, партнерство...",
    fullInterpretation: "Влюбленные символизируют не только романтические отношения, но и важные жизненные выборы. Эта карта указывает на необходимость принять решение, которое будет основано на ваших истинных ценностях. В отношениях она предвещает гармонию и глубокую связь. Если вы одиноки, карта может предсказывать встречу с особенным человеком. Важно помнить, что истинная любовь требует баланса между отдачей и получением."
  },
  {
    id: "death",
    name: "Смерть",
    image: "https://v3.fal.media/files/panda/4QyDcFBI8_Rd7rylGGK2t_output.png",
    shortMeaning: "Трансформация, окончания, новые начинания...",
    fullInterpretation: "Несмотря на пугающее название, карта Смерти символизирует трансформацию и обновление. Что-то в вашей жизни подходит к концу, освобождая место для нового. Это может быть окончание отношений, работы или старых убеждений. Важно принять эти изменения с открытым сердцем, понимая, что они необходимы для вашего роста. Сопротивление переменам только усилит страдания. Доверьтесь процессу трансформации."
  },
  {
    id: "sun",
    name: "Солнце",
    image: "https://v3.fal.media/files/zebra/9XTO1XmvBMMpezH87qgA2_output.png",
    shortMeaning: "Радость, успех, оптимизм, жизненная сила...",
    fullInterpretation: "Солнце - одна из самых позитивных карт в колоде. Она символизирует радость, успех и жизненную энергию. Все ваши усилия вскоре принесут плоды, а препятствия растворятся под лучами удачи. Эта карта особенно благоприятна для творческих проектов, отношений и здоровья. Она призывает вас наслаждаться жизнью и делиться своим светом с окружающими. Период трудностей позади, впереди вас ждет время процветания."
  },
  {
    id: "world",
    name: "Мир",
    image: "https://v3.fal.media/files/koala/mY6uUjUw4_WEYOSIesh8-_output.png",
    shortMeaning: "Завершение, достижение целей, гармония...",
    fullInterpretation: "Мир символизирует завершение важного жизненного цикла и достижение поставленных целей. Вы находитесь в состоянии гармонии и понимания своего места во Вселенной. Все ваши усилия увенчались успехом, и теперь можете наслаждаться плодами своего труда. Эта карта также указывает на расширение горизонтов - возможные путешествия или новые возможности на международном уровне. Вы готовы к новому циклу развития."
  }
];

type SpreadState = 'empty' | 'shuffling' | 'ready' | 'laid-out';

export default function TarotSpread() {
  const [selectedSpread, setSelectedSpread] = useState<string>("three-card");
  const [spreadState, setSpreadState] = useState<SpreadState>('empty');
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCardForPurchase, setSelectedCardForPurchase] = useState<TarotCard | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState<string | null>(null);

  const currentSpread = SPREADS.find(s => s.id === selectedSpread)!;

  const shuffleCards = useCallback(async () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    setSpreadState('shuffling');
    
    // Simulate shuffling animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSpreadState('ready');
    setIsShuffling(false);
    toast.success("Карты перетасованы и готовы к выкладке!");
  }, [isShuffling]);

  const drawCards = useCallback(async () => {
    if (spreadState !== 'ready') return;

    setSpreadState('laid-out');
    
    // Shuffle and select random cards
    const shuffled = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, currentSpread.cardCount);
    
    // Add positions to cards
    const cardsWithPositions = selected.map((card, index) => ({
      ...card,
      position: currentSpread.positions[index]
    }));

    setDrawnCards(cardsWithPositions);
    
    // Save to session storage
    if (typeof window !== "undefined") {
      const spreadData = {
        spreadId: selectedSpread,
        cards: cardsWithPositions,
        timestamp: Date.now()
      };
      sessionStorage.setItem('tarot-spread', JSON.stringify(spreadData));
    }

    toast.success("Карты выложены! Нажмите на карту для краткого толкования.");
  }, [spreadState, currentSpread, selectedSpread]);

  const handleCardClick = useCallback((card: TarotCard) => {
    if (showCardDetail === card.id) {
      setShowCardDetail(null);
    } else {
      setShowCardDetail(card.id);
    }
  }, [showCardDetail]);

  const handleFullInterpretation = useCallback((card: TarotCard) => {
    setSelectedCardForPurchase(card);
    setShowPurchaseModal(true);
  }, []);

  const handlePurchase = useCallback((type: 'single' | 'subscription') => {
    toast.success(
      type === 'single' 
        ? "Переход к оплате разового доступа..." 
        : "Переход к оформлению подписки..."
    );
    setShowPurchaseModal(false);
    // Here would be the actual payment flow
  }, []);

  // Load saved spread on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem('tarot-spread');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.cards?.length > 0) {
            setSelectedSpread(data.spreadId);
            setDrawnCards(data.cards);
            setSpreadState('laid-out');
          }
        } catch (error) {
          console.error('Failed to load saved spread:', error);
        }
      }
    }
  }, []);

  const resetSpread = useCallback(() => {
    setSpreadState('empty');
    setDrawnCards([]);
    setShowCardDetail(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('tarot-spread');
    }
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Расклады Таро с ИИ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите расклад, перетасуйте карты и получите персональное толкование от искусственного интеллекта
          </p>
        </div>

        {/* Spread Selection */}
        <Card className="mb-8 bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Spade className="w-5 h-5 text-primary" />
              Выбор расклада
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {SPREADS.map((spread) => (
                <div
                  key={spread.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                    selectedSpread === spread.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card/30'
                  }`}
                  onClick={() => {
                    setSelectedSpread(spread.id);
                    resetSpread();
                  }}
                >
                  <h3 className="font-medium mb-2">{spread.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{spread.description}</p>
                  <div className="text-xs text-primary">{spread.cardCount} карт</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={shuffleCards}
                disabled={isShuffling}
                variant="outline"
                className="flex-1 border-border/50 hover:border-primary/50"
              >
                <Dice3 className="w-4 h-4 mr-2" />
                {isShuffling ? "Перетасовка..." : "Перетасовать"}
              </Button>
              
              <Button
                onClick={drawCards}
                disabled={spreadState !== 'ready'}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium shadow-lg hover:shadow-primary/25"
              >
                Выложить карты
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Display */}
        <AnimatePresence mode="wait">
          {spreadState === 'empty' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Spade className="w-12 h-12 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Выберите расклад и перетасуйте карты, чтобы начать
              </p>
            </motion.div>
          )}

          {spreadState === 'shuffling' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Dice3 className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
              <p className="text-muted-foreground">Карты перетасовываются...</p>
            </motion.div>
          )}

          {spreadState === 'ready' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                <Spade className="w-12 h-12 text-accent" />
              </div>
              <p className="text-muted-foreground mb-4">
                Карты готовы! Нажмите "Выложить карты" для расклада "{currentSpread.name}"
              </p>
            </motion.div>
          )}

          {spreadState === 'laid-out' && drawnCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">
                    {currentSpread.name}
                  </CardTitle>
                  <p className="text-center text-muted-foreground text-sm">
                    Нажмите на карту для краткого толкования
                  </p>
                </CardHeader>
                <CardContent>
                  <div className={`grid gap-4 ${
                    currentSpread.cardCount === 3
                      ? 'grid-cols-1 md:grid-cols-3'
                      : currentSpread.cardCount === 5
                      ? 'grid-cols-2 md:grid-cols-5'
                      : 'grid-cols-2 md:grid-cols-5'
                  }`}>
                    {drawnCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="relative"
                      >
                        <div
                          className={`bg-card border rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 hover:border-primary/50 ${
                            showCardDetail === card.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleCardClick(card)}
                        >
                          <div className="aspect-[3/4] relative overflow-hidden">
                            <img
                              src={card.image}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="font-medium text-white text-sm">{card.name}</h3>
                              <p className="text-xs text-white/80">{card.position}</p>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {showCardDetail === card.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 p-4 bg-muted/30 rounded-lg border border-border/50"
                            >
                              <p className="text-sm text-muted-foreground mb-3">
                                {card.shortMeaning}
                              </p>
                              <Button
                                onClick={() => handleFullInterpretation(card)}
                                size="sm"
                                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Открыть полное толкование
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button
                      onClick={resetSpread}
                      variant="outline"
                      className="border-border/50 hover:border-primary/50"
                    >
                      Новый расклад
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Purchase Modal */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="bg-card border-border/50 max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Полное толкование
              </DialogTitle>
              <DialogDescription>
                Получите детальную интерпретацию карты "{selectedCardForPurchase?.name}"
              </DialogDescription>
            </DialogHeader>

            {selectedCardForPurchase && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h4 className="font-medium mb-2">{selectedCardForPurchase.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCardForPurchase.shortMeaning}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handlePurchase('single')}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                  >
                    Купить разовый доступ - 299₽
                  </Button>
                  
                  <Button
                    onClick={() => handlePurchase('subscription')}
                    variant="outline"
                    className="w-full border-border/50 hover:border-primary/50"
                  >
                    Подписка на месяц - 999₽
                    <span className="text-xs text-primary ml-2">(-60%)</span>
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowPurchaseModal(false)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <CircleX className="w-4 h-4 mr-2" />
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}