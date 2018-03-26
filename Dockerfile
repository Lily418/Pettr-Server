FROM node:8.5.0

WORKDIR /var/app

COPY package*.json /var/app/

RUN npm install

COPY . .

CMD ["npm", "start"]

# default + debugger ports
EXPOSE 3000
