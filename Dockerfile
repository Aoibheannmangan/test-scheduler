FROM node:16-bullseye AS build

# Update APT sources to use the correct archived repositories for Debian Bullseye
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
    && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list \
    && apt-get update && apt-get install -y \
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
RUN npm ci
COPY . ./
RUN npm run build


FROM node:16

# Update APT sources to use the correct archived repositories for Debian Bullseye
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
    && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list \
    && apt-get update && apt-get install -y \
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
RUN npm install --only=production

COPY --from=build /app/build /app/build

COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]
