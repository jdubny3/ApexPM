# Production Dockerfile for ApexPM on Google Cloud Run
FROM node:20-slim

# Install OpenSSL (required by Prisma on Linux), CA certificates, and curl
RUN apt-get update -y && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Disable Next.js telemetry collection during build
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package manifests first for optimal layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including TypeScript, Tailwind, Autoprefixer, PostCSS)
RUN npm install --include=dev

# Copy application source
COPY . .

# Generate Prisma Client for the Linux container environment
RUN npx prisma generate

# Build Next.js production bundle (uses standard production build mode)
RUN npm run build

# Pre-seed SQLite database with 100% verified Summer 2027 NYC & SF Bay Area PM roles
RUN npx tsx scripts/seed.ts

# Set runtime production environment variables for Cloud Run
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Cloud Run defaults to listening on port 8080
EXPOSE 8080

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
