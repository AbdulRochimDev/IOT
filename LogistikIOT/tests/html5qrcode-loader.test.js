process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'commonjs' })
require('ts-node/register')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { loadHtml5Qrcode } = require('../lib/html5qrcode-loader.ts')

test('loadHtml5Qrcode rejects when executed on the server', async () => {
  await assert.rejects(loadHtml5Qrcode(), /browser/)
})
