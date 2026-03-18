# 🚀 Как да пуснеш DrinkBuddy онлайн

## Опция 1: Netlify (Препоръчана)

### Чрез Netlify Drop (Най-лесно)
1. Направи build на проекта:
   ```bash
   npm run build
   ```

2. Отвори https://app.netlify.com/drop

3. Влачи папката `dist` директно в браузъра

4. Готово! Netlify ще ти даде URL като `https://your-app-name.netlify.app`

### Чрез Netlify CLI
1. Инсталирай Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

4. Избери `dist` като publish directory

## Опция 2: Vercel (Също лесно)

1. Отвори https://vercel.com

2. Натисни "Add New Project"

3. Импортирай папката или upload-ни файловете

4. Vercel автоматично ще открие че е Vite проект

5. Натисни Deploy

## Опция 3: GitHub Pages

1. Създай GitHub repo и качи кода

2. Инсталирай gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Добави в package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## 📱 Достъп от телефон

След като deploy-неш, ще получиш URL като:
- `https://drinkbuddy-app.netlify.app`
- `https://drinkbuddy-app.vercel.app`
- `https://yourusername.github.io/drinkbuddy-app`

Просто отвори този URL от телефона си и можеш да го добавиш към Home Screen за по-добро изживяване!

## 🔧 Важно

Приложението използва localStorage, така че:
- Данните се запазват само в твоя браузър
- При почистване на кеша, данните ще се изтрият
- За production версия трябва backend с база данни

## 🎯 Бърз Deploy

Ако искаш най-бързо:
```bash
npm run build
```
После отвори https://app.netlify.com/drop и влачи папката `dist`

Готово! 🎉
