# ─── Stage 1: shared base (Node 20 + Python 3 + pip packages) ───────────────
FROM node:20-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# ─── Stage 2: development (hot-reload via mounted volumes) ───────────────────
FROM base AS development

COPY package.json package-lock.json ./
RUN npm ci

ENV PYTHON_PATH=python3
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ─── Stage 3: builder (production next build) ────────────────────────────────
FROM base AS builder

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* vars are baked into the JS bundle at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL \
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

RUN npm run build

# ─── Stage 4: production runner (slim standalone image) ──────────────────────
FROM base AS production

ENV NODE_ENV=production \
    PYTHON_PATH=python3 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Copy standalone output (includes server.js + minimal node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Python chart-generation script must be at src/scripts/ relative to cwd
COPY --from=builder /app/src/scripts ./src/scripts

EXPOSE 3000
CMD ["node", "server.js"]
