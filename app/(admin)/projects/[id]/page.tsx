import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { getUserParishes } from '@/lib/parish-context'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireAuth()
  
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  const parishes = await getUserParishes()
  const userParishIds = parishes.map((p) => p.id)
  
  if (!userParishIds.includes(project.parish_id)) {
    redirect('/admin/projects')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-2">Update project details</p>
      </div>
      <ProjectForm parishes={parishes} project={project} />
    </div>
  )
}

