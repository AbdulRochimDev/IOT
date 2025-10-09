
export const metadata = { title: 'Logistics IoT', description: 'MVP WMS + Camera Scan' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 16 }}>
        <nav style={{ display:'flex', gap:12, marginBottom:16 }}>
          <a href="/">Home</a>
          <a href="/scan">Scan</a>
          <a href="/inventory">Inventory</a>
          <a href="/inbound">Inbound</a>
          <a href="/outbound">Outbound</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
