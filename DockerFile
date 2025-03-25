# Перейдите в директорию вашего проекта (предположим, мы используем автоматизацию CI/CD)
cd ~/projects/AUTOFRONTEND

# Создадим Dockerfile
cat > Dockerfile << 'EOL'
# Этап сборки
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
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Экспонируем порты
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
EOL

# Создадим директорию для конфигурации Nginx в проекте
mkdir -p nginx

cp /home/admin/projects/auto/front/nginx/default.conf nginx/default.conf