import { AdminLayout } from '@/components/layouts/AdminLayout'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect('/login')
    }

    return <AdminLayout>{children}</AdminLayout>
  } catch (error) {
    // If there's an error (e.g., Supabase client creation fails), redirect to login
    console.error('Admin layout error:', error)
    redirect('/login')
  }
}

