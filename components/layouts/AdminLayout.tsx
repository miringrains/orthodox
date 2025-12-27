'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Megaphone,
  Headphones,
  Heart,
  DollarSign,
  FolderKanban,
  Settings,
  Menu,
  X,
  LogOut,
  Navigation,
  Church,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [parishName, setParishName] = useState<string | null>(null)
  const [parishLogo, setParishLogo] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchParish() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: membership } = await supabase
        .from('parish_users')
        .select('parish_id')
        .eq('user_id', user.id)
        .single()

      if (membership?.parish_id) {
        const { data: parish } = await (supabase as any)
          .from('parishes')
          .select('name, logo_url')
          .eq('id', membership.parish_id)
          .single()
        
        if (parish) {
          setParishName(parish.name)
          setParishLogo(parish.logo_url)
        }
      }
    }
    fetchParish()
  }, [supabase])

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/pages', label: 'Pages', icon: FileText },
    { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
    { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/sermons', label: 'Sermons', icon: Headphones },
    { href: '/admin/giving', label: 'Giving', icon: DollarSign },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/community-needs', label: 'Community Needs', icon: Heart },
    { href: '/admin/reports', label: 'Reports', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-neutral-900
          transform transition-transform duration-200 ease-in-out
          shadow-[1px_0_0_0_rgba(0,0,0,0.05)]
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center">
                <Image
                  src="/projectorthv1.svg"
                  alt="Project Orthodox"
                  width={160}
                  height={60}
                  className="h-9 w-auto"
                  priority
                />
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Parish name subtitle */}
            {parishName && (
              <div className="mt-4 flex items-center gap-2.5 px-1">
                {parishLogo ? (
                  <Image
                    src={parishLogo}
                    alt={parishName}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded object-contain"
                  />
                ) : (
                  <Church className="w-4 h-4 text-neutral-400" />
                )}
                <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate font-medium">{parishName}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm transition-colors duration-150
                    ${isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium border-l-2 border-gold-500 -ml-[2px] pl-[calc(0.75rem+2px)]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-gold-600 dark:text-gold-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={handleLogout}
            >
              <LogOut className="h-[18px] w-[18px] mr-3" />
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden p-4 bg-white dark:bg-neutral-900 flex items-center justify-between shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Image
            src="/projectorthv1.svg"
            alt="Project Orthodox"
            width={120}
            height={45}
            className="h-8 w-auto"
          />
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
