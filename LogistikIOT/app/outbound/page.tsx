'use client'
export default function OutboundPage(){async function ship(){const r=await fetch('/api/outbound/shipments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:'BOX-001',qty:1})}); alert(await r.text())} return <button onClick={ship}>Ship 1 (BOX-001)</button>}
