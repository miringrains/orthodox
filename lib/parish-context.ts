import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

/**
 * Get the current user's parishes
 */
export async function getUserParishes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: parishUsers } = await supabase
    .from('parish_users')
    .select('parish_id, role, parishes(id, name, slug)')
    .eq('user_id', user.id)

  return parishUsers?.map((pu) => ({
    id: pu.parish_id,
    role: pu.role,
    ...(pu.parishes as any),
  })) || []
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

