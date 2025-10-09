import { db } from '@/lib/db'

export default async function InventoryPage() {
  const items = await db.item.findMany({ orderBy: { sku: 'asc' } })
  type InventoryItem = (typeof items)[number]

  return (
    <div>
      <h2>Inventory</h2>
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
    </div>
  )
}
