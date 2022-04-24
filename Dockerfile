FROM node:lts-slim

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

CMD ["npm", "start"]
