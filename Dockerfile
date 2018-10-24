FROM node:alpine

RUN apk update && \
    apk upgrade && \
    apk add git

COPY . /workspace
WORKDIR /workspace

RUN npm install --global gulp-cli
RUN npm install --global bower
RUN npm install

RUN bower install --allow-root
RUN gulp deploy

EXPOSE 3000
EXPOSE 8000

CMD npm start
