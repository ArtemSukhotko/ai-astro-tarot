# Технологический стек: AI Astro Tarot

## Основные технологии

-   **Фреймворк:** [Next.js](https://nextjs.org/) 15 (с Turbopack)
-   **Язык:** [TypeScript](https://www.typescriptlang.org/)
-   **Библиотека UI:** [React](https://react.dev/)
-   **Среда выполнения:** [Node.js](https://nodejs.org/)

## Стилизация и UI

-   **CSS-фреймворк:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI-компоненты:** [shadcn/ui](https://ui.shadcn.com/) - большая коллекция готовых компонентов, таких как `Button`, `Card`, `Dialog` и другие.
-   **Анимации:**
    -   [Framer Motion](https://www.framer.com/motion/) - для создания сложных и плавных анимаций.
    -   `tailwindcss-animate` - плагин для интеграции анимаций с Tailwind CSS.

## Формы и валидация

-   **Управление формами:** [React Hook Form](https://react-hook-form.com/) - для эффективного управления состоянием форм.
-   **Валидация схем:** [Zod](https://zod.dev/) - для строгой типизации и валидации данных форм.

## Инструменты разработки

-   **Менеджер пакетов:** `bun` (судя по наличию `bun.lock`)
-   **Линтер:** [ESLint](https://eslint.org/) - для поддержания качества и стиля кода.
-   **Конфигурация:** Проект использует `tsconfig.json` для настроек TypeScript и `next.config.ts` для конфигурации Next.js.

## Бэкенд и API

-   **API Routes:** Встроенные в Next.js серверные эндпоинты, расположенные в `src/app/api/`.
-   **Астрологические расчеты:** На данный момент используется mock-реализация в `src/app/api/astrology/calculate/route.ts`. В будущем планируется интеграция с полноценной астрологической библиотекой.