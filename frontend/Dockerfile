# 使用 Node.js 建立 React 靜態檔案
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 使用 Nginx 提供靜態檔案服務
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

# 對外暴露 Port 3000
EXPOSE 3000

# 使用預設的 Nginx 配置
CMD ["nginx", "-g", "daemon off;"]
