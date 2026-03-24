# leather-goods-megration

Интерактивная карта миграции кожаных изделий.

## Локальный запуск

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

2. Запустите приложение:
   ```bash
   python app.py
   ```

3. Откройте в браузере: `http://127.0.0.1:5000`

## Развертывание на Render.com

1. Создайте аккаунт на [Render.com](https://render.com)

2. Создайте новый **Web Service**

3. Подключите этот GitHub-репозиторий

4. Настройки:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment Variables**: (опционально, если нужно)

5. Нажмите **Create Web Service**

Приложение будет доступно по URL типа `https://leather-goods-megration.onrender.com`

## Функционал

- Интерактивная карта с Leaflet
- Добавление пинов с координатами, городом, страной, названием изделия, описанием и фото
- Переключение языка RU/EN
- Статистика: количество пинов, изделий, стран
- Хранение данных в JSON-файле

## Структура проекта

- `app.py` - Flask-приложение
- `templates/index.html` - HTML-шаблон
- `static/style.css` - стили
- `static/map.js` - JavaScript для карты и модалов
- `data/pins.json` - хранение пинов (не коммитится)
- `uploads/` - загруженные изображения (не коммитится)
