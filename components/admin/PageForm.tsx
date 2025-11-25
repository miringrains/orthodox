'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const pageSchema = z.object({
  parish_id: z.string().uuid('Please select a parish'),
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  kind: z.enum(['HOME', 'STATIC', 'SYSTEM']),
  builder_enabled: z.boolean().optional(),
})

type PageFormData = z.infer<typeof pageSchema>

interface PageFormProps {
  parishes: Array<{ id: string; name: string; slug: string }>
  page?: {
    id: string
    parish_id: string
    title: any // JSONB - can be string or {en: string}
    slug: string
    kind: string
    builder_enabled: boolean | null
  }
}

export function PageForm({ parishes, page }: PageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slugError, setSlugError] = useState<string>('')
  const supabase = createClient()

  // Extract title from JSONB format
  const getTitleString = (title: any): string => {
    if (typeof title === 'string') return title
    if (title && typeof title === 'object' && title.en) return title.en
    return ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: page
      ? {
          parish_id: page.parish_id,
          title: getTitleString(page.title),
          slug: page.slug,
          kind: page.kind as 'HOME' | 'STATIC' | 'SYSTEM',
          builder_enabled: page.builder_enabled ?? false,
        }
      : {
          kind: 'STATIC',
          builder_enabled: false,
        },
  })

  const watchedParishId = watch('parish_id')
  const watchedSlug = watch('slug')

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const currentSlug = watch('slug')
    
    // Only auto-generate if slug is empty or matches previous title
    if (!currentSlug || currentSlug === getTitleString(page?.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', generatedSlug)
    }
  }

  // Validate slug uniqueness
  const validateSlug = async (slug: string, parishId: string, excludeId?: string) => {
    if (!slug || !parishId) return true

    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('parish_id', parishId)
      .eq('slug', slug)
      .maybeSingle()

    if (existing && existing.id !== excludeId) {
      setSlugError('This slug is already in use for this parish')
      return false
    }

    setSlugError('')
    return true
  }

  const onSubmit = async (data: PageFormData) => {
    setIsSubmitting(true)
    setSlugError('')

    try {
      // Validate slug uniqueness
      const isSlugValid = await validateSlug(data.slug, data.parish_id, page?.id)
      if (!isSlugValid) {
        setIsSubmitting(false)
        return
      }

      // Convert title to JSONB format {en: title}
      const titleJson = { en: data.title }

      const pageData = {
        parish_id: data.parish_id,
        slug: data.slug,
        title: titleJson,
        kind: data.kind,
        builder_enabled: data.builder_enabled ?? false,
      }

      if (page) {
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', page.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('pages').insert(pageData)
        if (error) throw error
      }

      router.push('/admin/pages')
      router.refresh()
    } catch (error: any) {
      console.error('Error saving page:', error)
      
      // Check for unique constraint violation
      if (error?.code === '23505' || error?.message?.includes('unique')) {
        setSlugError('This slug is already in use for this parish')
      } else {
        alert('Failed to save page. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{page ? 'Edit Page' : 'Create Page'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parish Selection */}
          <div className="space-y-2">
            <Label htmlFor="parish_id">Parish *</Label>
            <Select
              defaultValue={page?.parish_id}
              onValueChange={(value) => {
                setValue('parish_id', value)
                // Re-validate slug when parish changes
                if (watchedSlug) {
                  validateSlug(watchedSlug, value, page?.id)
                }
              }}
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
            <Input
              id="title"
              {...register('title')}
              onChange={(e) => {
                register('title').onChange(e)
                handleTitleChange(e)
              }}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register('slug')}
              onChange={async (e) => {
                register('slug').onChange(e)
                const slug = e.target.value
                if (slug && watchedParishId) {
                  await validateSlug(slug, watchedParishId, page?.id)
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier (e.g., about-us, contact)
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            {slugError && <p className="text-sm text-destructive">{slugError}</p>}
          </div>

          {/* Kind */}
          <div className="space-y-2">
            <Label htmlFor="kind">Page Type *</Label>
            <Select
              defaultValue={page?.kind || 'STATIC'}
              onValueChange={(value) =>
                setValue('kind', value as 'HOME' | 'STATIC' | 'SYSTEM')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOME">Home Page</SelectItem>
                <SelectItem value="STATIC">Static Page</SelectItem>
                <SelectItem value="SYSTEM">System Page</SelectItem>
              </SelectContent>
            </Select>
            {errors.kind && (
              <p className="text-sm text-destructive">{errors.kind.message}</p>
            )}
          </div>

          {/* Builder Enabled */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="builder_enabled"
              {...register('builder_enabled')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="builder_enabled" className="cursor-pointer">
              Enable Page Builder
            </Label>
            <p className="text-xs text-muted-foreground ml-2">
              Allow visual editing with drag-and-drop components
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {page ? 'Update Page' : 'Create Page'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/pages')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

