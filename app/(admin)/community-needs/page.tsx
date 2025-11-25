import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CommunityNeedsPage() {
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

  const { data: needs } = await supabase
    .from('community_needs')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Needs</h1>
          <p className="text-muted-foreground mt-2">Manage internal fundraising campaigns</p>
        </div>
        <Button asChild>
          <Link href="/admin/community-needs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Need
          </Link>
        </Button>
      </div>

      {needs && needs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {needs.map((need) => (
            <Card key={need.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{need.title}</CardTitle>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    {need.visibility || 'public'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {(need.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                {need.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {need.description}
                  </p>
                )}
                {need.goal_amount && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        ${Number(need.current_amount || 0).toLocaleString()} / $
                        {Number(need.goal_amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((Number(need.current_amount || 0) / Number(need.goal_amount)) * 100),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/community-needs/${need.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No community needs yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

