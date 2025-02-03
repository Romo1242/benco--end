FROM node:latest

WORKDIR /home/app

COPY . /home/app

RUN npm install -g npm@8.5.4

EXPOSE 3000

CMD ["node", "/home/app/index.js"]