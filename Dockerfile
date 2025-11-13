# build environment
FROM node:20-alpine as build
ARG REACT_APP_API_URL
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN apk add --no-cache python3 make g++
RUN npm ci
COPY . .
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
