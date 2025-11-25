'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

const projectSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  project_type: z.enum(['building', 'mission', 'charity', 'monastery']).optional(),
  goal_amount: z.string().optional(),
  is_visible: z.boolean().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  project?: {
    id: string
    parish_id: string
    title: string
    description: string | null
    project_type: string | null
    goal_amount: number | null
    is_visible: boolean | null
  }
}

export function ProjectForm({ parishes, project }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          parish_id: project.parish_id,
          title: project.title,
          description: project.description || '',
          project_type: (project.project_type as any) || undefined,
          goal_amount: project.goal_amount?.toString() || '',
          is_visible: project.is_visible ?? true,
        }
      : {
          is_visible: true,
        },
  })

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const projectData = {
        parish_id: data.parish_id,
        created_by: user.id,
        title: data.title,
        description: data.description || null,
        project_type: data.project_type || null,
        goal_amount: data.goal_amount ? parseFloat(data.goal_amount) : null,
        is_visible: data.is_visible,
      }

      if (project) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(projectData)
        if (error) throw error
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Create Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={project?.parish_id}
              onValueChange={(value) => setValue('parish_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a parish" />
              </SelectTrigger>
              <SelectContent>
                {parishes.map((parish) => (
                  <SelectItem key={parish.id} value={parish.id}>
                    {parish.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parish_id && (
              <p className="text-sm text-destructive">{errors.parish_id.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={6} />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="project_type">Project Type</Label>
            <Select
              defaultValue={project?.project_type || undefined}
              onValueChange={(value) =>
                setValue('project_type', value as 'building' | 'mission' | 'charity' | 'monastery')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="mission">Mission</SelectItem>
                <SelectItem value="charity">Charity</SelectItem>
                <SelectItem value="monastery">Monastery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goal Amount */}
          <div className="space-y-2">
            <Label htmlFor="goal_amount">Goal Amount ($)</Label>
            <Input
              id="goal_amount"
              type="number"
              step="0.01"
              {...register('goal_amount')}
              placeholder="0.00"
            />
          </div>

          {/* Is Visible */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_visible"
              {...register('is_visible')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_visible" className="cursor-pointer">
              Visible on public site
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? 'Update Project' : 'Create Project'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/projects')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

