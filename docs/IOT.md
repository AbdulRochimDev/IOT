
# IoT Arsitektur & Payload

**Device → (MQTT broker) → Webhook HTTPS → `/api/iot/ingest` → TiDB.**
- Tanda tangan HMAC SHA-256 atas `JSON.stringify({ts,seq,type,data})` menggunakan `secret` dari `DeviceKey`.

## Payload Ingest (device)
```json
{
  "keyId": "devkey_demo",
  "sig": "base64(hmacSHA256(body, secret))",
  "ts": 1730456301000,
  "seq": 128,
  "type": "temp",
  "data": { "c": 6.2 }
}
```

## Payload Scan (browser)
```json
{ "code": "BOX-001", "mode": "inbound|outbound|count", "warehouseCode": "WH-A", "qty": 1 }
```
