import { listInventory } from '@/lib/inventory'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function InventoryPage() {
  const { items, error } = await listInventory()

  return (
    <div>
      <h2>Inventory</h2>
      {error ? (
        <p style={{ color: 'tomato' }}>{error}</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#666' }}>No inventory records found.</p>
      ) : (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.sku}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && (
        <details style={{ marginTop: 12 }}>
          <summary>Troubleshooting</summary>
          <p>
            Ensure the TiDB/MySQL database is reachable and that the Prisma connection
            string is configured in <code>.env</code> / Vercel project environment
            variables.
          </p>
        </details>
      )}
    </div>
  )
}
