import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

/**
 * Get the current user's parishes
 */
export async function getUserParishes() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Error getting user:', userError)
    return []
  }
  
  if (!user) {
    console.log('No user found')
    return []
  }

  // First get parish_user records
  const { data: parishUsers, error: parishUsersError } = await supabase
    .from('parish_users')
    .select('parish_id, role')
    .eq('user_id', user.id)

  if (parishUsersError) {
    console.error('Error fetching parish_users:', parishUsersError)
    return []
  }

  if (!parishUsers || parishUsers.length === 0) {
    console.log(`No parish_users found for user ${user.id} (${user.email})`)
    return []
  }

  // Then fetch parish details for each parish_id
  const parishIds = parishUsers.map((pu) => pu.parish_id)
  const { data: parishes, error: parishesError } = await supabase
    .from('parishes')
    .select('id, name, slug')
    .in('id', parishIds)

  if (parishesError) {
    console.error('Error fetching parishes:', parishesError)
    return []
  }

  if (!parishes || parishes.length === 0) {
    console.log(`No parishes found for parish_ids: ${parishIds.join(', ')}`)
    return []
  }

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

