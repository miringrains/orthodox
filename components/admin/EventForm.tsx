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

const eventSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_type: z.enum(['sacramental', 'parish_event', 'external']),
  start_at: z.string().min(1, 'Start date/time is required'),
  end_at: z.string().optional(),
  location: z.string().optional(),
  is_feast: z.boolean().optional(),
  feast_name: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  event?: {
    id: string
    parish_id: string
    title: string
    description: string | null
    event_type: string
    start_at: string
    end_at: string | null
    location: string | null
    is_feast: boolean | null
    feast_name: string | null
  }
}

export function EventForm({ parishes, event }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          parish_id: event.parish_id,
          title: event.title,
          description: event.description || '',
          event_type: event.event_type as 'sacramental' | 'parish_event' | 'external',
          start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
          end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
          location: event.location || '',
          is_feast: event.is_feast || false,
          feast_name: event.feast_name || '',
        }
      : {
          event_type: 'parish_event',
          is_feast: false,
        },
  })

  const isFeast = watch('is_feast')

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const eventData = {
        parish_id: data.parish_id,
        created_by: user.id,
        title: data.title,
        description: data.description || null,
        event_type: data.event_type,
        start_at: new Date(data.start_at).toISOString(),
        end_at: data.end_at ? new Date(data.end_at).toISOString() : null,
        location: data.location || null,
        is_feast: data.is_feast,
        feast_name: data.is_feast ? data.feast_name || null : null,
      }

      if (event) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert(eventData)
        if (error) throw error
      }

      router.push('/admin/events')
      router.refresh()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Create Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={event?.parish_id}
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

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type *</Label>
            <Select
              defaultValue={event?.event_type || 'parish_event'}
              onValueChange={(value) =>
                setValue('event_type', value as 'sacramental' | 'parish_event' | 'external')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sacramental">Sacramental Service</SelectItem>
                <SelectItem value="parish_event">Parish Event</SelectItem>
                <SelectItem value="external">External Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date/Time */}
          <div className="space-y-2">
            <Label htmlFor="start_at">Start Date & Time *</Label>
            <Input
              id="start_at"
              type="datetime-local"
              {...register('start_at')}
            />
            {errors.start_at && (
              <p className="text-sm text-destructive">{errors.start_at.message}</p>
            )}
          </div>

          {/* End Date/Time */}
          <div className="space-y-2">
            <Label htmlFor="end_at">End Date & Time</Label>
            <Input
              id="end_at"
              type="datetime-local"
              {...register('end_at')}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} />
          </div>

          {/* Is Feast */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_feast"
              {...register('is_feast')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_feast" className="cursor-pointer">
              This is a feast day
            </Label>
          </div>

          {/* Feast Name */}
          {isFeast && (
            <div className="space-y-2">
              <Label htmlFor="feast_name">Feast Name</Label>
              <Input id="feast_name" {...register('feast_name')} />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? 'Update Event' : 'Create Event'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/events')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

