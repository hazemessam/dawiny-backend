FROM node:lts-slim

WORKDIR /app

COPY package-lock.json .

RUN npm ci --only=production

COPY . .

CMD ["npm", "start"]
