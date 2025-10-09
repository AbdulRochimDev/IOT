import assert from "node:assert/strict"
import test from "node:test"

import { loadHtml5Qrcode } from "../lib/html5qrcode-loader"

test('loadHtml5Qrcode rejects when executed on the server', async () => {
  await assert.rejects(loadHtml5Qrcode(), /browser/)
})
