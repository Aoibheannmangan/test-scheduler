
FROM node:16-bullseye AS build 

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    g++ \
    make \
    libsqlite3-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

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


COPY server.js ./      

EXPOSE 5000

CMD ["node", "server.js"]
