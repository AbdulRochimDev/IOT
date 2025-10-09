
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 border-b flex items-center justify-between">
          <div>LogiX IoT</div>
          <nav className="space-x-4 text-sm">
            <a href="/scan">Scan</a>
            <a href="/inventory">Inventory</a>
            <a href="/inbound">Inbound</a>
            <a href="/outbound">Outbound</a>
          </nav>
        </header>
        <main className="p-6 max-w-6xl mx-auto space-y-6">{children}</main>
      </body>
    </html>
  )
}
