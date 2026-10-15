FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY app.js server.js ./
COPY public ./public
EXPOSE 8080
CMD ["node", "server.js"]
