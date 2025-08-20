# Use official Node.js image as the base
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies for build (Vite, Tailwind, etc. are devDependencies)
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
