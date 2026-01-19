import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, FolderKanban, Users, MoreHorizontal, Mail, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  planning: { 
    bg: 'bg-purple-100 dark:bg-purple-500/20', 
    text: 'text-purple-700 dark:text-purple-400',
    label: 'Future Planning'
  },
  active: { 
    bg: 'bg-emerald-100 dark:bg-emerald-500/20', 
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Active'
  },
  completed: { 
    bg: 'bg-blue-100 dark:bg-blue-500/20', 
    text: 'text-blue-700 dark:text-blue-400',
    label: 'Completed'
  },
  cancelled: { 
    bg: 'bg-stone-100 dark:bg-neutral-700', 
    text: 'text-stone-600 dark:text-neutral-400',
    label: 'Cancelled'
  },
}

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

  // Filter by status (cast to any for new columns not yet in types)
  const activeProjects = projects?.filter(p => 
    !(p as any).status || (p as any).status === 'active'
  ) || []
  const planningProjects = projects?.filter(p => (p as any).status === 'planning') || []
  const completedProjects = projects?.filter(p => (p as any).status === 'completed') || []

  const renderProjectCard = (project: NonNullable<typeof projects>[0]) => {
    const status = (project as any).status || 'active'
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['active']
    const imageUrl = (project as any).image_url
    const donorCount = (project as any).donor_count || 0
    const lastUpdate = (project as any).last_update
    
    const goalAmount = Number(project.goal_amount || 0)
    const currentAmount = Number(project.current_amount || 0)
    const progress = goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0

    return (
      <div 
        key={project.id}
        className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl overflow-hidden hover:border-stone-300 dark:hover:border-neutral-600 transition-colors"
      >
        {/* Image */}
        <div className="h-40 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderKanban className="h-12 w-12 text-stone-300 dark:text-neutral-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-stone-900 dark:text-neutral-100 line-clamp-1">
              {project.title}
            </h3>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          {goalAmount > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-[12px] mb-1">
                <span className={`font-medium ${statusStyle.text}`}>
                  {progress.toFixed(0)}% Funded
                </span>
                <span className="text-stone-500 dark:text-neutral-400">
                  ${currentAmount.toLocaleString()} / ${goalAmount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-gold-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-[12px] text-stone-500 dark:text-neutral-400 mb-3">
            {donorCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {donorCount} donors
              </span>
            )}
            {lastUpdate && (
              <span className="line-clamp-1">
                {lastUpdate}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="h-3.5 w-3.5 mr-1" />
              Draft Email Blast
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/projects/${project.id}`}>
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-900 dark:text-neutral-100" style={{ letterSpacing: '-0.02em' }}>
            Projects
          </h1>
          <p className="text-stone-500 dark:text-neutral-400 mt-2 text-[15px] tracking-wide">
            Manage fundraising and parish projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active Fundraising ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="planning" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Future Planning ({planningProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Completed ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeProjects.map(renderProjectCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="h-6 w-6 text-stone-400 dark:text-neutral-500" />
                </div>
                <p className="text-stone-500 dark:text-neutral-400 text-[15px] tracking-wide">
                  No active projects. Create your first one!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planning">
          {planningProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {planningProjects.map(renderProjectCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[14px]">
                  No projects in planning stage
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedProjects.map(renderProjectCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-stone-500 dark:text-neutral-400 text-[14px]">
                  No completed projects yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
