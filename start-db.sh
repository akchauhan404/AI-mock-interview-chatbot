#!/bin/bash

# Start Prisma dev server in the background
npx prisma dev --accept-data-loss &>/dev/null &
PRISMA_PID=$!

echo "Waiting for Prisma dev server to start..."
sleep 10 # Give it some time to initialize

# Apply migrations
echo "Applying Prisma migrations..."
npx prisma migrate deploy

# Keep the script running to keep the Prisma dev server alive
wait $PRISMA_PID

