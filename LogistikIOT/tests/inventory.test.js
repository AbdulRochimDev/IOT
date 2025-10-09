process.env.NODE_ENV = 'test'
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'commonjs' })
require('ts-node/register')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { listInventory, inventoryErrorMessage } = require('../lib/inventory.ts')

test('listInventory returns rows when database succeeds', async () => {
  const expected = [
    { sku: 'BOX-001', name: 'Box', qty: 10 },
    { sku: 'PAL-001', name: 'Pallet', qty: 2 },
  ]
  const client = {
    item: {
      findMany: async () => expected,
    },
  }

  const result = await listInventory(client)
  assert.deepEqual(result, { items: expected })
})

test('listInventory returns empty array and error when database fails', async () => {
  const failingClient = {
    item: {
      findMany: async () => {
        throw new Error('database offline')
      },
    },
  }

  const result = await listInventory(failingClient)
  assert.equal(result.items.length, 0)
  assert.equal(result.error, inventoryErrorMessage)
})
