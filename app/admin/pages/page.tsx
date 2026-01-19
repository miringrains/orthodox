import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Plus, FileText, Home, ExternalLink, MoreHorizontal, Eye, GripVertical, Settings, Trash2, Copy, Pencil } from 'lucide-react'

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Website Pages
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-base">
            Manage your parish website pages and navigation
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <div className="flex items-center p-5 gap-5">
            {/* Thumbnail placeholder */}
            <div className="w-28 h-20 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Home className="h-7 w-7 text-stone-400 dark:text-neutral-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-stone-900 dark:text-neutral-100">Home Page</h2>
                <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  getPageStatus(homePage) === 'published' 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {getPageStatus(homePage) === 'published' ? '● Published' : '● Draft'}
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-neutral-400 mt-1">
                {parishSlug ? `/p/${parishSlug}` : 'Your main landing page'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {parishSlug && (
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/p/${parishSlug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link href={`/admin/pages/${homePage.id}/builder`}>
                  Edit in Builder
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/pages/${homePage.id}`} className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Page Settings
                    </Link>
                  </DropdownMenuItem>
                  {parishSlug && (
                    <DropdownMenuItem asChild>
                      <Link href={`/p/${parishSlug}`} target="_blank" className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live Site
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* All Pages Section */}
      <div>
        <h2 className="font-display text-2xl text-stone-900 dark:text-neutral-100 mb-5" style={{ letterSpacing: '-0.01em' }}>
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
                <div key={page.id} className="flex items-center p-5 gap-5 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors">
                  {/* Drag handle */}
                  <button className="text-stone-300 dark:text-neutral-600 hover:text-stone-500 dark:hover:text-neutral-400 cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </button>

                  {/* Thumbnail placeholder */}
                  <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-stone-400 dark:text-neutral-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-stone-900 dark:text-neutral-100">{title}</span>
                      <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        status === 'published' 
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        ● {status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {pageUrl && (
                      <p className="text-sm text-stone-400 dark:text-neutral-500 mt-1">
                        {pageUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button asChild variant="outline">
                      <Link href={`/admin/pages/${page.id}/builder`}>
                        Edit
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/pages/${page.id}/builder`} className="flex items-center">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit in Builder
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/pages/${page.id}`} className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Page Settings
                          </Link>
                        </DropdownMenuItem>
                        {pageUrl && (
                          <DropdownMenuItem asChild>
                            <Link href={pageUrl} target="_blank" className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Live
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Page
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Page
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-5">
                <FileText className="h-7 w-7 text-stone-400 dark:text-neutral-500" />
              </div>
              <p className="text-stone-500 dark:text-neutral-400 text-base mb-5">
                No additional pages yet
              </p>
              <Button asChild variant="outline">
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
