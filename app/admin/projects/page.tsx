import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, FolderKanban } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
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

  const { data: projects } = await supabase
    .from('projects')
    .select('*, parishes(name)')
    .in('parish_id', parishIds)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Projects
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage parish fundraising projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <p className="text-[13px] text-stone-500 dark:text-neutral-400 tracking-wide">
                  {(project.parishes as any)?.name || 'Unknown Parish'}
                </p>
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="text-[14px] text-stone-600 dark:text-neutral-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.goal_amount && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[13px] mb-2 tracking-wide">
                      <span className="text-stone-500 dark:text-neutral-400">Progress</span>
                      <span className="text-stone-700 dark:text-neutral-200 font-medium">
                        ${Number(project.current_amount || 0).toLocaleString()} / $
                        {Number(project.goal_amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((Number(project.current_amount || 0) / Number(project.goal_amount)) *
                              100),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
            </div>
            <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
              No projects yet. Create your first one!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
