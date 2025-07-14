FROM node:18-alpine AS builder

WORKDIR /app

COPY apps/ingestion-service/package*.json ./
RUN npm install

COPY apps/ingestion-service/ ./
COPY libs/ ./libs/
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY apps/ingestion-service/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/libs ./libs

EXPOSE 3004

CMD ["node", "dist/main"] 