import { AdminLayout } from '@/components/layouts/AdminLayout'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Force dynamic rendering - critical for auth-dependent routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}

