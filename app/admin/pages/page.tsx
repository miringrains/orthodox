import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, FileText, Home, ExternalLink, Palette } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PagesPage() {
  await requireAuth()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's parishes
  const { data: parishUsers } = await supabase
    .from('parish_users')
    .select('parish_id, parishes(id, name, slug)')
    .eq('user_id', user.id)

  const parishIds = parishUsers?.map((pu) => pu.parish_id) || []
  const firstParish = parishUsers?.[0]?.parishes as { id: string; name: string; slug: string } | null
  const parishId = parishIds[0]
  const parishSlug = firstParish?.slug

  // Get all pages
  let { data: pages } = await supabase
    .from('pages')
    .select('*, parishes(name, slug)')
    .in('parish_id', parishIds)
    .order('kind', { ascending: true })
    .order('created_at', { ascending: false })

  // Auto-create home page if missing
  let homePage = pages?.find(p => p.kind === 'HOME')
  if (!homePage && parishId) {
    const { data: newPage } = await supabase
      .from('pages')
      .insert({
        parish_id: parishId,
        title: 'Home',
        slug: 'home',
        kind: 'HOME',
        builder_enabled: true,
        builder_schema: null,
        is_published: false,
      })
      .select('*, parishes(name, slug)')
      .single()
    
    if (newPage) {
      homePage = newPage
      pages = [newPage, ...(pages || [])]
    }
  }

  const additionalPages = pages?.filter(p => p.kind !== 'HOME') || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Website Pages
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage your parish website
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Link>
        </Button>
      </div>

      {/* Home Page - Primary */}
      {homePage && (
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Home className="h-6 w-6 text-gold-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Home Page</h2>
                <p className="text-stone-400 text-sm">
                  {(homePage as any).is_published ? 'Published' : 'Draft'} • 
                  {homePage.builder_schema ? ' Has content' : ' No content yet'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {parishSlug && (
                <Button asChild variant="ghost" className="text-stone-300 hover:text-white hover:bg-stone-700">
                  <Link href={`/p/${parishSlug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live
                  </Link>
                </Button>
              )}
              <Button asChild className="bg-gold-500 hover:bg-gold-600 text-stone-900 font-semibold">
                <Link href={`/admin/pages/${homePage.id}/builder`}>
                  <Palette className="h-4 w-4 mr-2" />
                  Edit in Builder
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Pages */}
      <div>
        <h2 className="font-display text-xl text-stone-900 dark:text-neutral-100 mb-4" style={{ letterSpacing: '-0.01em' }}>
          Additional Pages
        </h2>
        
        {additionalPages.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {additionalPages.map((page) => {
              const parish = page.parishes as { name?: string; slug?: string } | null
              const title = typeof page.title === 'string' 
                ? page.title 
                : (page.title as Record<string, string>)?.en || 'Untitled'

              return (
                <Card key={page.id}>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                      {parish?.name || 'Unknown Parish'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[11px] font-medium uppercase tracking-wider bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 px-2 py-1 rounded">
                        {page.kind}
                      </span>
                      {page.builder_enabled && (
                        <span className="text-[11px] font-medium uppercase tracking-wider bg-stone-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-1 rounded">
                          Builder
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/pages/${page.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      </Button>
                      {page.builder_enabled && (
                        <Button asChild size="sm">
                          <Link href={`/admin/pages/${page.id}/builder`}>
                            <Palette className="h-4 w-4 mr-2" />
                            Builder
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
              </div>
              <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide mb-4">
                No additional pages yet
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/pages/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add About, Contact, or other pages
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
