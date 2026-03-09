# Blog

Блог на Next.js 15 з повним CRUD, темною темою та анімаціями переходів.

## 🚀 Функції

- **Повний CRUD** — створення, читання, оновлення, видалення постів
- **Темна/світла тема** — Atom Dark тема з перемикачем і збереженням в localStorage
- **View Transitions API** — плавні fade-in/fade-out переходи між сторінками
- **Пагінація** — навігація по сторінках з постів
- **Server Components** — всі дані завантажуються на сервері
- **Server Actions** — форми працюють без API routes
- **Валідація** — клієнтська валідація форм (мін. 6 символів)
- **shadcn/ui** — красиві та доступні компоненти

## 🛠 Технології

- **Next.js 15** — React фреймворк з App Router
- **React 19** — остання версія з Server Components
- **TypeScript** — типізація всього коду
- **Tailwind CSS** — утилітарні стилі
- **shadcn/ui** — компоненти (Button, Card, Input, тощо)
- **date-fns** — форматування дат
- **Hono API** — бекенд на Hono з PostgreSQL

## 📦 Встановлення

```bash
# Встановити залежності
npm install

# Запустити дев сервер
npm run dev

# Запустити Storybook
npm run storybook
```

Відкрийте [http://localhost:3000](http://localhost:3000) для додатку або [http://localhost:6006](http://localhost:6006) для Storybook.

## 📁 Структура

```
app/
├── page.tsx              # Головна сторінка з постами
├── layout.tsx            # Root layout з ThemeProvider
├── globals.css           # Глобальні стилі та CSS змінні
└── posts/
    ├── [id]/
    │   ├── page.tsx      # Сторінка поста
    │   ├── action.ts     # Delete action
    │   └── edit/
    │       ├── page.tsx  # Сторінка редагування
    │       ├── action.ts # Update action
    │       └── EditPostForm.tsx
    └── create/
        ├── page.tsx      # Сторінка створення
        └── action.ts     # Create action

components/
├── PostCard.tsx          # Картка поста
├── Pagination.tsx        # Пагінація
├── ThemeToggle.tsx       # Перемикач теми
├── ThemeProvider.tsx     # Context для теми
├── TransitionLink.tsx    # Link з View Transitions
└── ui/                   # shadcn/ui компоненти
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── label.tsx
    ├── separator.tsx
    ├── skeleton.tsx
    ├── badge.tsx
    └── dropdown-menu.tsx

lib/
├── api.ts                # API функції
├── types.ts              # TypeScript типи
└── utils.ts              # Утиліти
```

## 🎨 Теми

### Світла (Light)
- Чистий білий фон
- Сірі тексті для контрасту
- Стиль Medium/форумів

### Темна (Atom Dark)
- Темно-сірий фон (#282c34)
- Світло-сірий текст (#abb2bf)
- Натхненна Atom One Dark

## 🔌 API

Бекенд: [hono-on-vercel](https://github.com/your-username/hono-on-vercel)

```
GET    /api/posts          # Список постів з пагінацією
GET    /api/posts/:id      # Окремий пост
POST   /api/posts          # Створити пост
PATCH  /api/posts/:id      # Оновити пост
DELETE /api/posts/:id      # Видалити пост
```

## 📝 Приклади

### Створення поста
1. Клікніть **+** в хедері
2. Заповніть форму (заголовок, автор, контент)
3. Натисніть "Створити пост"

### Редагування
1. Відкрийте пост
2. Клікніть ✏️
3. Змініть дані та збережіть

### Видалення
1. Відкрийте пост
2. Клікніть −
3. Пост видалено, редірект на головну

### Перемикання теми
- Клікніть 🌙/☀️ в хедері
- Тема зберігається в localStorage

## 🚀 Деплой

### Vercel (рекомендовано)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t blog .
docker run -p 3000:3000 blog
```

## 📖 Storybook

Storybook доступний для перегляду компонентів ізольовано:

```bash
npm run storybook
```

Відкрийте [http://localhost:6006](http://localhost:6006)

### Доступні сторіз:

**UI Компоненти:**
- `UI/Button` — всі варіанти кнопок
- `UI/Card` — картки з різними конфігураціями
- `UI/Input` — поля вводу з типами
- `UI/Textarea` — текстові поля
- `UI/Separator` — розділювачі
- `UI/Skeleton` — завантаження скелетони
- `UI/Badge` — бейджі

**Компоненти:**
- `Components/PostCard` — картка поста
- `Components/Pagination` — пагінація
- `Components/ThemeToggle` — перемикач теми

## 📄 Ліцензія

MIT
