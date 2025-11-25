import { redirect } from 'next/navigation'
import { getUserParishes } from '@/lib/parish-context'
import { requireAuth } from '@/lib/auth'
import { ProjectForm } from '@/components/admin/ProjectForm'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  await requireAuth()
  const parishes = await getUserParishes()

  if (parishes.length === 0) {
    redirect('/admin/settings')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Project</h1>
        <p className="text-muted-foreground mt-2">Create a new fundraising project</p>
      </div>
      <ProjectForm parishes={parishes} />
    </div>
  )
}

