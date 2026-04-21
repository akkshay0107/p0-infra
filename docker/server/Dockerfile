FROM node:22-slim
WORKDIR /app
COPY . .
RUN npm ci --production && node build
EXPOSE 8000
CMD ["node", "pokemon-showdown", "start"]
