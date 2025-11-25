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

const announcementSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
  is_pinned: z.boolean().optional(),
  scheduled_for: z.string().optional(),
})

type AnnouncementFormData = z.infer<typeof announcementSchema>

interface AnnouncementFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  announcement?: {
    id: string
    parish_id: string
    title: string
    content: string
    category: string | null
    is_pinned: boolean | null
    scheduled_for: string | null
  }
}

export function AnnouncementForm({ parishes, announcement }: AnnouncementFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: announcement
      ? {
          parish_id: announcement.parish_id,
          title: announcement.title,
          content: announcement.content,
          category: announcement.category || '',
          is_pinned: announcement.is_pinned || false,
          scheduled_for: announcement.scheduled_for
            ? new Date(announcement.scheduled_for).toISOString().slice(0, 16)
            : '',
        }
      : {
          is_pinned: false,
        },
  })

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const announcementData = {
        parish_id: data.parish_id,
        created_by: user.id,
        title: data.title,
        content: data.content,
        category: data.category || null,
        is_pinned: data.is_pinned,
        scheduled_for: data.scheduled_for ? new Date(data.scheduled_for).toISOString() : null,
        published_at: data.scheduled_for ? null : new Date().toISOString(),
      }

      if (announcement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', announcement.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('announcements').insert(announcementData)
        if (error) throw error
      }

      router.push('/admin/announcements')
      router.refresh()
    } catch (error) {
      console.error('Error saving announcement:', error)
      alert('Failed to save announcement. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{announcement ? 'Edit Announcement' : 'Create Announcement'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={announcement?.parish_id}
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

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea id="content" {...register('content')} rows={8} />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="e.g., Liturgical, Pastoral Letter, Parish Life" />
          </div>

          {/* Is Pinned */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_pinned"
              {...register('is_pinned')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_pinned" className="cursor-pointer">
              Pin this announcement to the top
            </Label>
          </div>

          {/* Scheduled For */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_for">Schedule for (optional)</Label>
            <Input
              id="scheduled_for"
              type="datetime-local"
              {...register('scheduled_for')}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to publish immediately
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {announcement ? 'Update Announcement' : 'Create Announcement'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/announcements')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

