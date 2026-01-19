import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, FileText, Home, ExternalLink, Palette, MoreHorizontal, Eye, GripVertical, Settings } from 'lucide-react'

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
      })
      .select('*, parishes(name, slug)')
      .single()
    
    if (newPage) {
      homePage = newPage
      pages = [newPage, ...(pages || [])]
    }
  }

  const additionalPages = pages?.filter(p => p.kind !== 'HOME') || []

  // Helper to get page status
  const getPageStatus = (page: typeof homePage) => {
    if (!page?.builder_schema) return 'draft'
    return 'published'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Website Pages
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage your parish website pages and navigation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Global Styles
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/pages/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Link>
          </Button>
        </div>
      </div>

      {/* Home Page - Primary */}
      {homePage && (
        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
          <div className="flex items-center p-4 gap-4">
            {/* Thumbnail placeholder */}
            <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Home className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-neutral-100">HomePage</h2>
                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  getPageStatus(homePage) === 'published' 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {getPageStatus(homePage) === 'published' ? '● Published' : '● Draft'}
                </span>
              </div>
              <p className="text-[13px] text-stone-500 dark:text-neutral-400 mt-0.5">
                {parishSlug ? `/p/${parishSlug}` : 'Your main landing page'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {parishSlug && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/p/${parishSlug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link href={`/admin/pages/${homePage.id}/builder`}>
                  Edit in Builder
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All Pages Section */}
      <div>
        <h2 className="font-display text-xl text-stone-900 dark:text-neutral-100 mb-4" style={{ letterSpacing: '-0.01em' }}>
          All Pages
        </h2>
        
        {additionalPages.length > 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl overflow-hidden divide-y divide-stone-100 dark:divide-neutral-800">
            {additionalPages.map((page) => {
              const parish = page.parishes as { name?: string; slug?: string } | null
              const title = typeof page.title === 'string' 
                ? page.title 
                : (page.title as Record<string, string>)?.en || 'Untitled'
              const status = getPageStatus(page)
              const pageUrl = parish?.slug && page.slug ? `/p/${parish.slug}/${page.slug}` : null

              return (
                <div key={page.id} className="flex items-center p-4 gap-4 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors">
                  {/* Drag handle */}
                  <button className="text-stone-300 dark:text-neutral-600 hover:text-stone-500 dark:hover:text-neutral-400 cursor-grab">
                    <GripVertical className="h-4 w-4" />
                  </button>

                  {/* Thumbnail placeholder */}
                  <div className="w-16 h-12 rounded bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-stone-400 dark:text-neutral-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900 dark:text-neutral-100">{title}</span>
                      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        status === 'published' 
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        ● {status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {pageUrl && (
                      <p className="text-[12px] text-stone-400 dark:text-neutral-500 mt-0.5">
                        url: {pageUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/pages/${page.id}/builder`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
