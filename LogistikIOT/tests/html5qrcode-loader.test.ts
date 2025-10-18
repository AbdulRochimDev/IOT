import assert from 'node:assert/strict'

import { loadHtml5Qrcode } from '../lib/html5qrcode-loader'

async function main() {
  try {
    await assert.rejects(loadHtml5Qrcode(), /browser/)
    console.log('✓ loadHtml5Qrcode rejects when executed on the server')
  } catch (error) {
    console.error('✗ loadHtml5Qrcode rejects when executed on the server')
    console.error(error)
    process.exitCode = 1
  }
}

void main()
