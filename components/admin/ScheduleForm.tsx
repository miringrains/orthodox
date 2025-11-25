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

const scheduleSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  service_type: z.string().min(1, 'Service type is required'),
  day_of_week: z.number().min(0).max(6).nullable(),
  time: z.string().optional(),
  is_recurring: z.boolean().optional(),
  notes: z.string().optional(),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface ScheduleFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  schedule?: {
    id: string
    parish_id: string
    service_type: string
    day_of_week: number | null
    time: string | null
    is_recurring: boolean | null
    notes: string | null
  }
}

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export function ScheduleForm({ parishes, schedule }: ScheduleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: schedule
      ? {
          parish_id: schedule.parish_id,
          service_type: schedule.service_type,
          day_of_week: schedule.day_of_week,
          time: schedule.time || '',
          is_recurring: schedule.is_recurring ?? true,
          notes: schedule.notes || '',
        }
      : {
          is_recurring: true,
        },
  })

  const isRecurring = watch('is_recurring')

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true)
    try {
      const scheduleData = {
        parish_id: data.parish_id,
        service_type: data.service_type,
        day_of_week: data.is_recurring ? data.day_of_week : null,
        time: data.time || null,
        is_recurring: data.is_recurring,
        notes: data.notes || null,
      }

      if (schedule) {
        const { error } = await supabase
          .from('service_schedules')
          .update(scheduleData)
          .eq('id', schedule.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('service_schedules').insert(scheduleData)
        if (error) throw error
      }

      router.push('/admin/schedule')
      router.refresh()
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('Failed to save schedule. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{schedule ? 'Edit Service' : 'Create Service'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={schedule?.parish_id}
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

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service_type">Service Type *</Label>
            <Input
              id="service_type"
              {...register('service_type')}
              placeholder="e.g., Divine Liturgy, Vespers, Matins"
            />
            {errors.service_type && (
              <p className="text-sm text-destructive">{errors.service_type.message}</p>
            )}
          </div>

          {/* Is Recurring */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_recurring"
              {...register('is_recurring')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_recurring" className="cursor-pointer">
              Recurring service (weekly)
            </Label>
          </div>

          {/* Day of Week */}
          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="day_of_week">Day of Week *</Label>
              <Select
                defaultValue={schedule?.day_of_week?.toString()}
                onValueChange={(value) => setValue('day_of_week', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" {...register('time')} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} rows={3} />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {schedule ? 'Update Service' : 'Create Service'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/schedule')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

