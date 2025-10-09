
# Logistics IoT (Vercel + TiDB + Camera Scan)

**MVP WMS** fokus **IoT** (tanpa web3) dengan **scan kamera dari browser** (HP) + API stok & pergerakan.

## Fitur
- Scan barcode/QR via kamera HP di halaman **/scan** (ZXing).
- Inventory & movement dasar (IN/OUT/ADJ).
- IoT ingest endpoint dengan **HMAC** (untuk device fisik/gateway).
- Siap deploy di **Vercel**; database **TiDB/MySQL** via **Prisma**.

## Quick start
```bash
cd apps/web
pnpm i
cp .env.example .env.local
# isi DATABASE_URL (TiDB) -> mysql://user:pass@host:4000/db?sslaccept=strict
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev  # http://localhost:3000
```

### Halaman
- `/scan` — kamera & scanner
- `/inventory` — daftar stok
- `/inbound` — demo GRN (stok IN 10 untuk BOX-001)
- `/outbound` — aksi Pick → Pack → Ship → Deliver

### API
- `POST /api/scan/submit` → { code, mode: inbound|outbound|count, warehouseCode, qty }
- `POST /api/iot/ingest` → HMAC payload device
- `GET /api/inventory/stocks`
- `GET /api/outbound/shipments`, `POST /api/outbound/shipments`
- `POST /api/inbound/grn`
