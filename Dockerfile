# Step 1 Build
FROM node:lts AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2 Application Start
FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
COPY --from=builder /user/src/app/.env.docker ./.env
RUN npm install
ENTRYPOINT ["node", "dist/src/main.js"]