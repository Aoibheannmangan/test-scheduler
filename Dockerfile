FROM node:16 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:16
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=build /app/build /app/build
EXPOSE 3000
CMD ["node", "server.js"]
