#!/usr/bin/env bash
# setup-all.sh  —  One-file setup for Logistics IoT (Next.js + Prisma + TiDB)
# Usage:
#   bash setup-all.sh
# Env toggles:
#   DATABASE_URL   required for DB actions
#   RUN_MIGRATE=1  optional
#   RUN_SEED=1     optional
#   RUN_BUILD=1    optional

set -euo pipefail

# Locate project path
if [ -d "LogistikIOT/web" ]; then
  cd "LogistikIOT/web"
elif [ -d "/workspace/IOT/LogistikIOT/web" ]; then
  cd "/workspace/IOT/LogistikIOT/web"
else
  echo "❌ Cannot find LogistikIOT/web. Run from repo root."
  exit 1
fi

echo "📌 Working in $(pwd)"

# Create .env.local from DATABASE_URL if available
if [ -n "${DATABASE_URL:-}" ]; then
  printf 'DATABASE_URL="%s"\n' "$DATABASE_URL" > .env.local
  echo "✅ Wrote .env.local"
else
  echo "⚠️  DATABASE_URL not set (DB steps will be skipped unless you export it)."
fi

# Ensure Next/TS config files (overwrite to guarantee alias works)
cat > next-env.d.ts << 'EOF'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > next.config.mjs << 'EOF'
import path from 'path'
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = { ...(config.resolve.alias || {}), '@': path.resolve(__dirname, '.') }
    return config
  },
}
export default nextConfig
EOF

# Ensure .env.example exists
[ -f .env.example ] || cat > .env.example << 'EOF'
DATABASE_URL="mysql://<USER>:<PASS>@<HOST>:4000/<DB>?sslaccept=strict"
EOF

# Patch package.json minimal fields (via Node)
if [ -f package.json ]; then
  node - <<'EOF'
const fs = require('fs'); const p='package.json';
const j = JSON.parse(fs.readFileSync(p,'utf8'));
j.engines = Object.assign({node:'20.x'}, j.engines||{});
if(!j.packageManager) j.packageManager='pnpm@9.12.0';
j.scripts = Object.assign({typecheck:'tsc --noEmit'}, j.scripts||{});
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
console.log('✅ package.json patched');
EOF
else
  cat > package.json << 'EOF'
{
  "name": "logistics-iot-web",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "engines": { "node": "20.x" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "migrate": "prisma migrate deploy",
    "seed": "ts-node prisma/seed.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@prisma/client": "5.15.0",
    "@zxing/browser": "0.1.4",
    "@zxing/library": "0.21.2"
  },
  "devDependencies": {
    "prisma": "5.15.0",
    "typescript": "5.9.3",
    "ts-node": "10.9.2"
  }
}
EOF
fi

# Install deps (pnpm via npx)
npm config set registry https://registry.npmjs.org/ >/dev/null 2>&1 || true
npm config set fund false >/dev/null 2>&1 || true
npm config set audit false >/dev/null 2>&1 || true

echo "📦 Installing deps with pnpm…"
npx -y pnpm@9 install
echo "✅ Deps installed"

# Prisma generate + optional steps
npx prisma generate

if [ "${RUN_MIGRATE:-0}" = "1" ]; then
  npx prisma migrate deploy
fi

if [ "${RUN_SEED:-0}" = "1" ]; then
  npx prisma db seed
fi

if [ "${RUN_BUILD:-0}" = "1" ]; then
  npx pnpm@9 build
fi

echo "✅ setup-all.sh done."
