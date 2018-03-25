FROM node:8.5.0

WORKDIR /var/app

ARG NODE_ENV=development

COPY . .

RUN npm install
CMD ["npm", "start"]

# default + debugger ports
EXPOSE 3000
