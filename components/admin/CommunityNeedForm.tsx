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

const needSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  goal_amount: z.string().optional(),
  visibility: z.enum(['public', 'members_only', 'private']).optional(),
})

type NeedFormData = z.infer<typeof needSchema>

interface CommunityNeedFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  need?: {
    id: string
    parish_id: string
    title: string
    description: string | null
    goal_amount: number | null
    visibility: string | null
  }
}

export function CommunityNeedForm({ parishes, need }: CommunityNeedFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NeedFormData>({
    resolver: zodResolver(needSchema),
    defaultValues: need
      ? {
          parish_id: need.parish_id,
          title: need.title,
          description: need.description || '',
          goal_amount: need.goal_amount?.toString() || '',
          visibility: (need.visibility as 'public' | 'members_only' | 'private') || 'public',
        }
      : {
          visibility: 'public',
        },
  })

  const onSubmit = async (data: NeedFormData) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const needData = {
        parish_id: data.parish_id,
        created_by: user.id,
        title: data.title,
        description: data.description || null,
        goal_amount: data.goal_amount ? parseFloat(data.goal_amount) : null,
        visibility: data.visibility,
      }

      if (need) {
        const { error } = await supabase
          .from('community_needs')
          .update(needData)
          .eq('id', need.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('community_needs').insert(needData)
        if (error) throw error
      }

      router.push('/admin/community-needs')
      router.refresh()
    } catch (error) {
      console.error('Error saving community need:', error)
      alert('Failed to save community need. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{need ? 'Edit Community Need' : 'Create Community Need'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={need?.parish_id}
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

          {/* Visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              defaultValue={need?.visibility || 'public'}
              onValueChange={(value) =>
                setValue('visibility', value as 'public' | 'members_only' | 'private')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="members_only">Members Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Public: visible to everyone. Members Only: visible to logged-in parish members. Private: internal use only.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {need ? 'Update Need' : 'Create Need'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/community-needs')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

