import Link from 'next/link'

interface PublicLayoutProps {
  children: React.ReactNode
  parish: { name: string; slug: string } | null
  hideChrome?: boolean
}

export function PublicLayout({
  children,
  parish,
  hideChrome = false,
}: PublicLayoutProps) {
  // When hideChrome is true, render just the children (for builder pages)
  if (hideChrome) {
    return <div className="min-h-screen flex flex-col">{children}</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/p/${parish?.slug || ''}`} className="text-2xl font-bold">
              {parish?.name || 'Parish'}
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href={`/p/${parish?.slug || ''}/schedule`} className="hover:text-primary">
                Schedule
              </Link>
              <Link href={`/p/${parish?.slug || ''}/events`} className="hover:text-primary">
                Events
              </Link>
              <Link href={`/p/${parish?.slug || ''}/announcements`} className="hover:text-primary">
                Announcements
              </Link>
              <Link href={`/p/${parish?.slug || ''}/sermons`} className="hover:text-primary">
                Sermons
              </Link>
              <Link href={`/p/${parish?.slug || ''}/giving`} className="hover:text-primary">
                Giving
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {parish?.name || 'Parish'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
