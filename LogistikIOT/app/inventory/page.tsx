import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  type InventoryItems = Awaited<ReturnType<typeof db.item.findMany>>
  let items: InventoryItems = []
  let loadError: string | null = null

  try {
    items = await db.item.findMany({ orderBy: { sku: 'asc' } })
  } catch (error) {
    console.error('Failed to load inventory items', error)
    loadError = 'Unable to load inventory data. Please check your database connection.'
  }

  type InventoryItem = InventoryItems[number]

  return (
    <div>
      <h2>Inventory</h2>
      {loadError ? (
        <p role="alert">{loadError}</p>
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
            {items.map((item: InventoryItem) => (
              <tr key={item.sku}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
