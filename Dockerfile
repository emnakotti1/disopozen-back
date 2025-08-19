# Étape 1 : Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Étape 2 : Production
FROM node:20-alpine

WORKDIR /app

# Installer curl pour le healthcheck
RUN apk add --no-cache curl

COPY package*.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]

# Healthcheck (optionnel, mais pratique)
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD curl -f http://localhost:3000/health || exit 1
