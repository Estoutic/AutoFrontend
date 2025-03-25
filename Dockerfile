FROM node:18-alpine AS build
WORKDIR /app

# Копируем файлы пакетов и устанавливаем зависимости
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Копируем исходные файлы и собираем приложение
COPY . .
RUN yarn build

# Этап продакшн с Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Экспонируем порты
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
EOL