# Stage 1: build frontend
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json tsconfig*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the source code
COPY . .

# Make sure TypeScript config is applied before build
RUN npx tsc --noEmit

# Run build
RUN npm run build

# Stage 2: serve with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
