FROM node:22-slim
WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ wget && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3001
CMD ["node", "index.js"]
