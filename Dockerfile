FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install nodemon --save-dev

COPY . .

EXPOSE 5000

CMD ["npm","run", "dev"]