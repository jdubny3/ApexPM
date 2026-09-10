# Production Dockerfile for ApexPM on Google Cloud Run
FROM node:20-slim AS runner

# Install OpenSSL (required by Prisma on Linux), CA certificates, and curl
RUN apt-get update -y && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set Cloud Run production environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package manifests first for optimal layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies required for Next.js build & tsx seeding)
RUN npm install

# Copy application source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js production bundle
RUN npm run build

# Pre-seed SQLite database with 100% verified Summer 2027 NYC & SF Bay Area PM roles
RUN npx tsx scripts/seed.ts

# Ensure entrypoint is executable
RUN chmod +x docker-entrypoint.sh

# Cloud Run defaults to port 8080
EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
