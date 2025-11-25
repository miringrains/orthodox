import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Auth error:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getCurrentUserWithAdminStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { user: null, isPlatformAdmin: false }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_platform_admin')
    .eq('id', user.id)
    .single()

  return {
    user,
    isPlatformAdmin: profile?.is_platform_admin || false,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requirePlatformAdmin() {
  const { user, isPlatformAdmin } = await getCurrentUserWithAdminStatus()
  if (!isPlatformAdmin) {
    throw new Error('Unauthorized - Admin only')
  }
  return user
}

export async function getUserParishRole(parishId: string, userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('parish_users')
    .select('role')
    .eq('parish_id', parishId)
    .eq('user_id', userId)
    .single()

  return data?.role || null
}

export async function requireParishRole(
  parishId: string,
  allowedRoles: string[]
) {
  const user = await requireAuth()
  const role = await getUserParishRole(parishId, user.id)
  
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Unauthorized - Insufficient permissions')
  }
  
  return { user, role }
}

