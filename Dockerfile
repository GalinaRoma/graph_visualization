FROM node:10

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm ci
RUN npm run build

CMD ["npx", "serve", "dist/vis-graph"]
