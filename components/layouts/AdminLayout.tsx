'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const supabase = createClient()

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
    <div className="flex h-screen overflow-hidden bg-[#F6F5F2] dark:bg-[#121212]">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-[#191919] border-r border-[#D1CEC8] dark:border-[#2F2F2F]
          transform transition-transform duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-5 border-b border-[#D1CEC8] dark:border-[#2F2F2F] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center">
              <Image
                src="/projectorthv1.svg"
                alt="Project Orthodox"
                width={160}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#6A6761] hover:text-[#0B0B0B] hover:bg-[#EEECE6]"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md
                    text-sm font-medium
                    ${isActive
                      ? 'gold-polish gold-polish-depth text-[#3A2A08]'
                      : 'text-[#3A3A3A] dark:text-[#CFCAC2] hover:bg-[#EEECE6] dark:hover:bg-[#232323] transition-colors'
                    }
                  `}
                >
                  <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-[#3A2A08]' : 'text-[#8C8881]'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-[#D1CEC8] dark:border-[#2F2F2F]">
            <Button
              variant="ghost"
              className="w-full justify-start text-[#6A6761] hover:text-[#0B0B0B] hover:bg-[#EEECE6] dark:text-[#A8A39A] dark:hover:text-[#F3F2EE] dark:hover:bg-[#232323]"
              onClick={handleLogout}
            >
              <LogOut className="h-[18px] w-[18px] mr-3 text-[#8C8881]" />
              <span className="text-sm font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden p-4 border-b border-[#D1CEC8] dark:border-[#2F2F2F] bg-white dark:bg-[#191919] flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6A6761] hover:text-[#0B0B0B] hover:bg-[#EEECE6]"
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
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#F6F5F2] dark:bg-[#121212] p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
