# Blog - Next.js + Hono API

Повнофункціональний блог з CRUD операціями, темною темою, валідацією форм та E2E тестами.

**Demo:** https://my-next-five-pearl.vercel.app

## 🚀 Функції

- **CRUD операції** — створення, читання, оновлення, видалення постів
- **Коментарі** — додавання, редагування, видалення коментарів
- **JWT авторизація** — реєстрація, вхід, вихід, захист роутів
- **Темна/світла тема** — збереження в localStorage
- **Пагінація** — серверна пагінація для постів
- **Валідація форм** — клієнтська валідація з Zod
- **E2E тести** — 42+ Playwright тестів

## 🛠 Технології

| Компонент | Технологія |
|-----------|------------|
| **Frontend** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Мова** | TypeScript 5 |
| **Стилі** | Tailwind CSS 3.4 |
| **UI компоненти** | shadcn/ui |
| **Іконки** | Lucide React |
| **Форми** | React Hook Form + Zod |
| **Дати** | date-fns |
| **Тема** | next-themes |
| **Backend API** | Hono (PostgreSQL) |
| **Тести** | Playwright |

## 📦 Встановлення

```bash
# Встановити залежності
npm install

# Запустити dev сервер (http://localhost:3000)
npm run dev

# Запустити тести
npm run test

# Зібрати для продакшену
npm run build
```

## 📁 Структура проекту

```
my-next/
├── app/
│   ├── page.tsx              # Головна сторінка (SSR)
│   ├── layout.tsx            # Root layout з ThemeProvider
│   ├── globals.css           # Глобальні стилі
│   ├── api/                  # API routes (CORS проксі)
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── logout/route.ts
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── auth/
│   │   ├── login/page.tsx    # Сторінка входу
│   │   └── register/page.tsx # Сторінка реєстрації
│   └── posts/
│       ├── create/page.tsx   # Створення поста
│       └── [id]/
│           ├── page.tsx      # Перегляд поста
│           ├── edit/page.tsx # Редагування поста
│           └── CommentsSection.tsx
├── components/
│   ├── ui/                   # shadcn/ui компоненти
│   ├── ThemeToggle.tsx       # Перемикач теми
│   └── ThemeProvider.tsx     # Theme context
├── lib/
│   ├── api.ts                # API клієнт
│   ├── schemas.ts            # Zod схеми
│   └── types.ts              # TypeScript типи
├── tests/
│   ├── blog-e2e.spec.ts      # E2E тести (локально)
│   └── blog.prod.test.js     # Production тести
└── .env.local                # Змінні оточення
```

## 🔌 API

Бекенд: `https://hono-on-vercel-woad.vercel.app`

### Public endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts?page=1` | Список постів |
| GET | `/api/posts/:id` | Окремий пост |
| GET | `/api/posts/:id/comments` | Коментарі поста |

### Auth endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Реєстрація |
| POST | `/api/auth/login` | Вхід |
| POST | `/api/auth/logout` | Вихід |

### Protected endpoints (потрібен JWT токен)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Створити пост |
| PATCH | `/api/posts/:id` | Оновити пост |
| DELETE | `/api/posts/:id` | Видалити пост |
| POST | `/api/posts/:id/comments` | Створити коментар |
| PATCH | `/api/posts/:id/comments/:id` | Оновити коментар |
| DELETE | `/api/posts/:id/comments/:id` | Видалити коментар |

## 🧪 Тести

```bash
# Запустити всі тести
npm run test

# Запустити production тести
npx playwright test tests/blog.prod.test.js

# Запустити з UI
npx playwright test --ui
```

### Покриття тестів (26 тестів)
- ✅ Головна сторінка
- ✅ Пагінація
- ✅ Темна/світла тема
- ✅ Логін/Реєстрація
- ✅ Валідація форм
- ✅ Створення поста
- ✅ Редагування поста
- ✅ Коментарі
- ✅ Вихід

## 🎨 Теми

### Світла (Light)
- Чистий білий фон
- Сірий текст для контрасту
- Стиль Medium/форумів

### Темна (Dark)
- Темно-сірий фон (#282c34)
- Світло-сірий текст (#abb2bf)
- Натхненна Atom One Dark

## 🚀 Деплой

### Vercel (рекомендовано)

```bash
# Встановити Vercel CLI
npm install -g vercel

# Задеплоїти
vercel
```

### Змінні оточення

Створіть `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Для продакшену на Vercel додайте змінну:

```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📝 Приклади використання

### Реєстрація
1. Відкрийте `/auth/register`
2. Введіть ім'я, email, пароль
3. Натисніть "Зареєструватися"

### Вхід
1. Відкрийте `/auth/login`
2. Введіть email та пароль
3. Натисніть "Увійти"

### Створення поста
1. Увійдіть в акаунт
2. Натисніть "+ Створити пост"
3. Заповніть заголовок (мін. 6 символів) і контент
4. Натисніть "Створити пост"

### Редагування поста
1. Відкрийте пост
2. Натисніть ✏️ Edit
3. Змініть дані та збережіть

### Видалення поста
1. Відкрийте пост
2. Натисніть − Delete
3. Пост видалено, редірект на головну

### Коментарі
1. Відкрийте пост
2. Прогорніть до секції "Коментарі"
3. Увійдіть в акаунт
4. Введіть коментар та натисніть "Додати коментар"
5. Для редагування/видалення — ✏️ або − біля свого коментаря

### Перемикання теми
- Натисніть 🌙/☀️ в хедері
- Тема зберігається в localStorage

## 📄 Ліцензія

MIT
