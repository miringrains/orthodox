import { AdminLayout } from '@/components/layouts/AdminLayout'
import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAuth()
  } catch {
    redirect('/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}

