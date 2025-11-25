import { AdminLayout } from '@/components/layouts/AdminLayout'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}

