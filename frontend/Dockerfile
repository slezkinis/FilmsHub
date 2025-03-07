# Stage 1: Build the Next.js application
FROM node:20

WORKDIR /app

RUN mkdir -p /app/out
# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci
# RUN npm install
RUN echo "SERVER_URL=${SERVER_URL}"
# Copy source code
COPY . .
RUN npm run build
RUN chmod +x check_api_status.sh

# Build the application (Next.js 13+ uses output: 'export' for static generation)
#RUN npm run build

CMD ./check_api_status.sh
