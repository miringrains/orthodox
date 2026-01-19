'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { createClient } from '@/lib/supabase/client'
import { Loader2, Trash2 } from 'lucide-react'
import { CalendarEvent, EventType, EventStatus, EVENT_TYPE_LABELS } from './Calendar/types'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_type: z.string().min(1, 'Event type is required'),
  service_type: z.string().optional(),
  status: z.string(),
  start_at: z.string().min(1, 'Start date/time is required'),
  end_at: z.string().optional(),
  location: z.string().optional(),
  is_feast: z.boolean().optional(),
  feast_name: z.string().optional(),
  color: z.string().optional(),
})

interface EventFormData {
  title: string
  description?: string
  event_type: string
  service_type?: string
  status: string
  start_at: string
  end_at?: string
  location?: string
  is_feast?: boolean
  feast_name?: string
  color?: string
}

interface EventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: CalendarEvent | null
  parishId: string
  initialDate?: Date | null
  onSave: () => void
}

export function EventModal({ 
  open, 
  onOpenChange, 
  event, 
  parishId, 
  initialDate,
  onSave 
}: EventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_type: 'parish_event',
      status: 'published',
      is_feast: false,
    },
  })

  const eventType = watch('event_type')
  const isFeast = watch('is_feast')

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (open) {
      if (event) {
        reset({
          title: event.title,
          description: event.description || '',
          event_type: event.event_type,
          service_type: event.service_type || '',
          status: event.status || 'published',
          start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
          end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
          location: event.location || '',
          is_feast: event.is_feast || false,
          feast_name: event.feast_name || '',
          color: event.color || '',
        })
      } else {
        const startDate = initialDate || new Date()
        reset({
          title: '',
          description: '',
          event_type: 'parish_event',
          service_type: '',
          status: 'published',
          start_at: startDate.toISOString().slice(0, 16),
          end_at: '',
          location: '',
          is_feast: false,
          feast_name: '',
          color: '',
        })
      }
    }
  }, [open, event, initialDate, reset])

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      const eventData = {
        parish_id: parishId,
        created_by: user.id,
        title: data.title,
        description: data.description || null,
        event_type: data.event_type,
        service_type: data.service_type || null,
        status: data.status,
        start_at: new Date(data.start_at).toISOString(),
        end_at: data.end_at ? new Date(data.end_at).toISOString() : null,
        location: data.location || null,
        is_feast: data.is_feast || false,
        feast_name: data.is_feast ? data.feast_name || null : null,
        color: data.color || null,
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

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return
    if (!confirm('Are you sure you want to delete this event?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id)

      if (error) throw error

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Check if this is a service type event
  const isServiceType = ['divine_liturgy', 'vespers', 'matins', 'feast_day', 'saint_day', 'sacramental'].includes(eventType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Event Type */}
          <div className="space-y-2">
            <Label>Event Type *</Label>
            <Select
              value={eventType}
              onValueChange={(value) => setValue('event_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="divine_liturgy">Divine Liturgy</SelectItem>
                <SelectItem value="vespers">Vespers</SelectItem>
                <SelectItem value="matins">Matins</SelectItem>
                <SelectItem value="feast_day">Feast Day</SelectItem>
                <SelectItem value="saint_day">Saint Day</SelectItem>
                <SelectItem value="sacramental">Sacramental Service</SelectItem>
                <SelectItem value="parish_event">Parish Event</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="external">External</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.event_type && (
              <p className="text-sm text-destructive">{errors.event_type.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title" 
              {...register('title')} 
              placeholder={isServiceType ? EVENT_TYPE_LABELS[eventType as EventType] : 'Event title'}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date/Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_at">Start *</Label>
              <Input
                id="start_at"
                type="datetime-local"
                {...register('start_at')}
              />
              {errors.start_at && (
                <p className="text-sm text-destructive">{errors.start_at.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_at">End</Label>
              <Input
                id="end_at"
                type="datetime-local"
                {...register('end_at')}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              {...register('location')} 
              placeholder="e.g., Church Hall"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              rows={3}
              placeholder="Additional details..."
            />
          </div>

          {/* Feast checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_feast"
              {...register('is_feast')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_feast" className="cursor-pointer text-sm">
              This is a feast day
            </Label>
          </div>

          {/* Feast Name (conditional) */}
          {isFeast && (
            <div className="space-y-2">
              <Label htmlFor="feast_name">Feast Name</Label>
              <Input 
                id="feast_name" 
                {...register('feast_name')} 
                placeholder="e.g., Nativity of our Lord"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            {event ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {event ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
