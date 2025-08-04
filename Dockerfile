FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm config set strict-ssl false

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 6379 8000


CMD ["npm", "start"]
