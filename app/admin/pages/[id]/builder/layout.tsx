import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Force dynamic rendering - critical for auth-dependent routes
export const dynamic = 'force-dynamic'

// Builder layout - no AdminLayout wrapper, full screen for Puck
export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Return children directly without AdminLayout wrapper
  return <>{children}</>
}

