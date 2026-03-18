# 🔔 Известия (Notifications) Setup

## ✅ Добавени са Push Notifications!

Приложението вече поддържа известия за:
- 🎉 **Нови Matches** - когато някой те хареса
- 👋 **Нови потребители** - когато някой се регистрира
- 🔔 **Тестови известия** - за проверка

## 🚀 Как работят известията

### **1. Browser Notifications**
- Работят на всички модерни браузъри
- Не изискват инсталация на приложение
- Работят и на телефон (Chrome Mobile, Safari)

### **2. Service Worker**
- Автоматично се регистрира
- Работи дори когато приложението е затворено
- Кешира ресурси за offline работа

### **3. Real-time Updates**
- Известията се изпращат веднага
- Работят между всички устройства
- Синхронизират се с Supabase

## 📱 Как да активираш известия

### **За потребители:**
1. Влез в приложението
2. Отиди в **Профил**
3. Намери **"Известия"** секцията
4. Включи бутона за известия
5. Разреши в браузъра си (когато попита)

### **За разработка:**
1. В Supabase Dashboard → **SQL Editor**
2. Изпълни този SQL за push_subscriptions table:

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

## 🔧 Технически детайли

### **Files създадени:**
- `src/supabase/notificationService.js` - Notification логика
- `src/components/NotificationSettings.jsx` - UI за настройки
- `public/sw.js` - Service Worker за push notifications

### **Notification Types:**
- **match** - Нов match с потребител
- **new_user** - Нов потребител се регистрира
- **test** - Тестово известие

### **Browser Support:**
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)

## 🎯 Какво се случва при:

### **Нов Match:**
1. Потребител A хареса потребител B
2. Ако B също хареса A → MATCH!
3. А и B получават известие: "🎉 Нов Match!"

### **Нов потребител:**
1. Нов потребител се регистрира
2. Всички съществуващи потребители получават: "👋 Нов потребител!"

### **Тест:**
1. В профил → Известия → "Изпрати тестово известие"
2. Получаваш: "🎉 Тестово известие!"

## 📋 Deployment

За production, трябва да:
1. Deploy-неш на HTTPS (задължително за notifications)
2. Добавиш VAPID ключове в Supabase
3. Конфигурираш Supabase Edge Functions

## 🔔 Тестване

1. **Регистрирай 2 потребителя** на различни устройства
2. **Активирай известия** за двамата
3. **Направи match** между тях
4. **Провери дали получаваш известия**

## ⚠️ Важно

- Изисква HTTPS за production
- Потребителят трябва да разреши известия
- Работи само на модерни браузъри
- Service Worker трябва да е на корен път (`/sw.js`)

**Готово за тестване!** 🎉
