FROM node:10
RUN mkdir -p /home/node/app/dist
RUN chmod 0777 /home/node/app
WORKDIR //home/node/app

COPY package.json /home/node/app
COPY yarn.lock /home/node/app

RUN yarn

COPY . /home/node/app
RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start"]

