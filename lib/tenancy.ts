import { createClient } from '@/lib/supabase/server'

export async function getParishFromSlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parishes')
    .select('id, name, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function getParishIdFromSlug(slug: string): Promise<string | null> {
  const parish = await getParishFromSlug(slug)
  return parish?.id || null
}

