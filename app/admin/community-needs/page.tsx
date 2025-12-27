import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Heart } from 'lucide-react'

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
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Community Needs
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage internal fundraising campaigns
          </p>
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
                  <span className="text-[11px] font-medium uppercase tracking-wider bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 px-2 py-1 rounded">
                    {need.visibility || 'public'}
                  </span>
                </div>
                <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                  {(need.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                {need.description && (
                  <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4 line-clamp-2">
                    {need.description}
                  </p>
                )}
                {need.goal_amount && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[13px] mb-2 tracking-wide">
                      <span className="text-stone-500 dark:text-neutral-400">Progress</span>
                      <span className="text-stone-700 dark:text-neutral-200 font-medium">
                        ${Number(need.current_amount || 0).toLocaleString()} / $
                        {Number(need.goal_amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full"
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
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No community needs yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
