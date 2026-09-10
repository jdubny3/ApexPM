#!/bin/sh
set -e

# Initialize SQLite database if not present or empty
if [ ! -f /app/prisma/dev.db ] || [ ! -s /app/prisma/dev.db ]; then
  echo "=> SQLite database not found or empty. Initializing schema and seeding Summer 2027 opportunities..."
  npx prisma db push --skip-generate
  npx tsx scripts/seed.ts
else
  echo "=> SQLite database found with verified Summer 2027 opportunities."
fi

# Execute CMD passed from Dockerfile
exec "$@"
