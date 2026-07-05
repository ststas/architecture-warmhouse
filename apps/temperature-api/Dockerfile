FROM node:20-alpine

WORKDIR /app

# Install dependencies first to leverage Docker layer caching.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy the application source.
COPY index.js ./

# The mock sensor listens on 8081 by default.
EXPOSE 8081

CMD ["node", "index.js"]
