import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'

export default async function PagesPage() {
  await requireAuth()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's parishes
  const { data: parishUsers } = await supabase
    .from('parish_users')
    .select('parish_id')
    .eq('user_id', user.id)

  const parishIds = parishUsers?.map((pu) => pu.parish_id) || []

  const { data: pages } = await supabase
    .from('pages')
    .select('*, parishes(name, slug)')
    .in('parish_id', parishIds)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground mt-2">Manage your parish website pages</p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      {pages && pages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const parish = page.parishes as any
            const title = typeof page.title === 'string' 
              ? page.title 
              : (page.title as any)?.en || 'Untitled'

            return (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {parish?.name || 'Unknown Parish'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-muted px-2 py-1 rounded">{page.kind}</span>
                    {page.builder_enabled && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Builder
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/pages/${page.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    {page.builder_enabled && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/pages/${page.id}/builder`}>Builder</Link>
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
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No pages yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

