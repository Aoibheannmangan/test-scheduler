# Stage 1: Build React app
FROM node:16 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Set up the production environment for Node.js
FROM node:16
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the built React app into the container
COPY --from=build /app/build /app/build

# Copy server.js into the container (corrected line)
COPY server.js ./      # This copies server.js from your local directory into the container's working directory

# Expose the correct port
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]
