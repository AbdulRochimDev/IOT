import { db } from '@/lib/db'
export default async function InventoryPage(){const items=await db.item.findMany({orderBy:{sku:'asc'}});return(<div><h2>Inventory</h2><table border={1} cellPadding={6}><thead><tr><th>SKU</th><th>Name</th><th>Qty</th></tr></thead><tbody>{items.map(i=><tr key={i.sku}><td>{i.sku}</td><td>{i.name}</td><td>{i.qty}</td></tr>)}</tbody></table></div>)}
