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

const sermonSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  audio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  text_content: z.string().optional(),
  date_preached: z.string().optional(),
})

type SermonFormData = z.infer<typeof sermonSchema>

interface SermonFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  sermon?: {
    id: string
    parish_id: string
    title: string
    description: string | null
    audio_url: string | null
    video_url: string | null
    text_content: string | null
    date_preached: string | null
  }
}

export function SermonForm({ parishes, sermon }: SermonFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: sermon
      ? {
          parish_id: sermon.parish_id,
          title: sermon.title,
          description: sermon.description || '',
          audio_url: sermon.audio_url || '',
          video_url: sermon.video_url || '',
          text_content: sermon.text_content || '',
          date_preached: sermon.date_preached
            ? new Date(sermon.date_preached).toISOString().slice(0, 10)
            : '',
        }
      : {},
  })

  const onSubmit = async (data: SermonFormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const sermonData = {
        parish_id: data.parish_id,
        created_by: user.id,
        title: data.title,
        description: data.description || null,
        audio_url: data.audio_url || null,
        video_url: data.video_url || null,
        text_content: data.text_content || null,
        date_preached: data.date_preached ? new Date(data.date_preached).toISOString() : null,
      }

      if (sermon) {
        const { error } = await supabase
          .from('sermons')
          .update(sermonData)
          .eq('id', sermon.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('sermons').insert(sermonData)
        if (error) throw error
      }

      router.push('/admin/sermons')
      router.refresh()
    } catch (error) {
      console.error('Error saving sermon:', error)
      alert('Failed to save sermon. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sermon ? 'Edit Sermon' : 'Create Sermon'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={sermon?.parish_id}
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
            <Textarea id="description" {...register('description')} rows={4} />
          </div>

          {/* Audio URL */}
          <div className="space-y-2">
            <Label htmlFor="audio_url">Audio URL</Label>
            <Input id="audio_url" type="url" {...register('audio_url')} placeholder="https://..." />
            {errors.audio_url && (
              <p className="text-sm text-destructive">{errors.audio_url.message}</p>
            )}
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
            <Input id="video_url" type="url" {...register('video_url')} placeholder="https://..." />
            {errors.video_url && (
              <p className="text-sm text-destructive">{errors.video_url.message}</p>
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <Label htmlFor="text_content">Text Content</Label>
            <Textarea id="text_content" {...register('text_content')} rows={10} />
          </div>

          {/* Date Preached */}
          <div className="space-y-2">
            <Label htmlFor="date_preached">Date Preached</Label>
            <Input id="date_preached" type="date" {...register('date_preached')} />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sermon ? 'Update Sermon' : 'Create Sermon'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/sermons')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

