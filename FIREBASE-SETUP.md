# 🔥 Firebase Setup Instructions

## Стъпка 1: Създай Firebase проект

1. Отвори https://console.firebase.google.com/
2. Натисни **"Add project"** (Създай проект)
3. Име на проект: **DrinkBuddy** (или каквото искаш)
4. Следвай стъпките и създай проекта

## Стъпка 2: Активирай Authentication

1. В Firebase Console → **Authentication**
2. Натисни **"Get started"**
3. Избери **"Email/Password"**
4. Enable и запази

## Стъпка 3: Активирай Firestore Database

1. В Firebase Console → **Firestore Database**
2. Натисни **"Create database"**
3. Избери **"Start in test mode"** (за сега)
4. Избери локация (europe-west3 за Европа)
5. Натисни **"Enable"**

## Стъпка 4: Активирай Storage (за снимки)

1. В Firebase Console → **Storage**
2. Натисни **"Get started"**
3. Избери **"Start in test mode"**
4. Натисни **"Done"**

## Стъпка 5: Вземи Firebase Config

1. В Firebase Console → **Project Settings** (иконка със зъбно колело)
2. Scroll down до **"Your apps"**
3. Натисни иконката **</> (Web)**
4. Регистрирай app: **DrinkBuddy Web**
5. **Копирай** firebaseConfig обекта

Ще изглежда така:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "drinkbuddy-xxxxx.firebaseapp.com",
  projectId: "drinkbuddy-xxxxx",
  storageBucket: "drinkbuddy-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

## Стъпка 6: Постави Config в проекта

1. Отвори файла: **src/firebase/config.js**
2. Замести стойностите в `firebaseConfig` с твоите:

```javascript
const firebaseConfig = {
  apiKey: "ТВОЯТ_API_KEY",
  authDomain: "ТВОЯТ_PROJECT_ID.firebaseapp.com",
  projectId: "ТВОЯТ_PROJECT_ID",
  storageBucket: "ТВОЯТ_PROJECT_ID.appspot.com",
  messagingSenderId: "ТВОЯТ_MESSAGING_SENDER_ID",
  appId: "ТВОЯТ_APP_ID"
};
```

3. Запази файла

## Стъпка 7: Security Rules (важно за production)

### Firestore Rules
В Firebase Console → Firestore Database → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
В Firebase Console → Storage → Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## ✅ Готово!

След като направиш това, приложението ще работи между всички устройства! 🚀

## 🧪 Тестване

1. Регистрирай акаунт от телефон
2. Регистрирай друг акаунт от лаптоп
3. Влез в първия акаунт от телефон
4. Трябва да видиш втория акаунт в swipe картите!

## 📱 Deployment

След Firebase setup, трябва да rebuild-неш:
```bash
npm run build
```

И deploy-ни отново на Netlify/Vercel.
