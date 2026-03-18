# 🚀 Supabase Setup Instructions

## ✅ Инсталиран Supabase - сега вземи конфигурацията!

### **Стъпка 1: Вземи Supabase URL и Key**

1. Отвори твоя Supabase проект: https://app.supabase.com
2. В лявото меню → **Project Settings** (иконка ⚙️)
3. Scroll до **"API"**
4. Ще видиш:
   - **Project URL** (https://xxxxx.supabase.co)
   - **API Key** (anon public)

### **Стъпка 2: Постави в config.js**

Отвори: **`src/supabase/config.js`**

Замести това:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

С твоите данни:
```javascript
const supabaseUrl = 'https://xxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### **Стъпка 3: Създай Database Tables**

В Supabase Dashboard → **Table Editor** → **Create Table**:

#### **Users Table:**
- Name: `users`
- Columns:
  - `id` (uuid, primary key)
  - `name` (text)
  - `email` (text, unique)
  - `age` (int8)
  - `city` (text)
  - `favoriteDrink` (text)
  - `bio` (text)
  - `photo` (text)
  - `interests` (text, array)
  - `status` (text, default 'active')
  - `created_at` (timestamptz, default now)

#### **Matches Table:**
- Name: `matches`
- Columns:
  - `id` (uuid, primary key, default uuid_generate_v4())
  - `user_id` (uuid, foreign key to users.id)
  - `matched_user_id` (uuid)
  - `name` (text)
  - `image` (text)
  - `drink` (text)
  - `distance` (text)
  - `compatibilityScore` (int8)
  - `matched_at` (timestamptz, default now)

### **Стъпка 4: Активирай Authentication**

В Supabase Dashboard → **Authentication** → **Settings**:
- Enable **Email/Password**
- Confirm email: **Off** (за development)

### **Стъпка 5: Update App**

Промени `src/main.jsx`:
```javascript
import App from './AppWithSupabase.jsx'; // Supabase версия
```

## 🎯 Готово за тестване!

След като направиш това:
```bash
npm run dev
```

Приложението ще работи между всички устройства! 🚀

## 📱 Тестване:

1. Регистрирай се от телефон
2. Регистрирай се от лаптоп  
3. Влез в първия акаунт от телефон
4. Трябва да видиш втория акаунт в картите!

## 🔧 SQL за Tables (ако искаш бързо)

В Supabase Dashboard → **SQL Editor**:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  favoriteDrink TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  interests TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  matched_user_id UUID,
  name TEXT,
  image TEXT,
  drink TEXT,
  distance TEXT,
  compatibilityScore INTEGER,
  matched_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Изпълни този SQL и готово!** 🎉
