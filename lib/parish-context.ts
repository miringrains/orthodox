import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

/**
 * Get the current user's parishes
 */
export async function getUserParishes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // First get parish_user records
  const { data: parishUsers, error } = await supabase
    .from('parish_users')
    .select('parish_id, role')
    .eq('user_id', user.id)

  if (error || !parishUsers || parishUsers.length === 0) {
    return []
  }

  // Then fetch parish details for each parish_id
  const parishIds = parishUsers.map((pu) => pu.parish_id)
  const { data: parishes } = await supabase
    .from('parishes')
    .select('id, name, slug')
    .in('id', parishIds)

  if (!parishes) return []

  // Combine parish data with roles
  return parishes.map((parish) => {
    const parishUser = parishUsers.find((pu) => pu.parish_id === parish.id)
    return {
      id: parish.id,
      name: parish.name,
      slug: parish.slug,
      role: parishUser?.role || 'viewer',
    }
  })
}

/**
 * Get the active parish ID from cookies or return the first parish
 */
export async function getActiveParishId(): Promise<string | null> {
  const cookieStore = await cookies()
  const activeParishId = cookieStore.get('active_parish_id')?.value
  
  if (activeParishId) {
    return activeParishId
  }

  // Fallback to first parish
  const parishes = await getUserParishes()
  return parishes[0]?.id || null
}

/**
 * Get the active parish with full details
 */
export async function getActiveParish() {
  const parishId = await getActiveParishId()
  if (!parishId) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('parishes')
    .select('*')
    .eq('id', parishId)
    .single()

  return data
}

