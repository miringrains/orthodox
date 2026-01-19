'use client'

import { useNode } from '@craftjs/core'
import { useState, useEffect, useRef } from 'react'
import { Image as ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ColorPicker } from '../controls/ColorPicker'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { useParishContext } from '../contexts/ParishContext'
import { createClient } from '@/lib/supabase/client'

interface MediaAsset {
  id: string
  file_name: string
  file_url: string
  file_type: string | null
  created_at: string | null
}

interface GalleryGridProps {
  title?: string
  limit?: number
  columns?: number
  showLightbox?: boolean
  // Theme-aware colors
  textColor?: string
  mutedTextColor?: string
}

export function GalleryGrid({ 
  title, 
  limit = 9,
  columns = 3,
  showLightbox = true,
  textColor = '',
  mutedTextColor = '',
}: GalleryGridProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const { parishId, isEditorMode } = useParishContext()
  const [images, setImages] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Container width for responsive columns
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1200)

  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch images from media_assets
  useEffect(() => {
    async function fetchImages() {
      if (!parishId) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('media_assets')
          .select('*')
          .eq('parish_id', parishId)
          .like('file_type', 'image/%')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (fetchError) throw fetchError
        setImages(data || [])
      } catch (err) {
        console.error('Error fetching images:', err)
        setError('Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [parishId, limit])

  // Responsive columns
  const getActualColumns = () => {
    if (containerWidth < 640) return 2
    if (containerWidth < 900) return Math.min(columns, 3)
    return columns
  }
  const actualColumns = getActualColumns()

  // Lightbox handlers
  const openLightbox = (index: number) => {
    if (showLightbox) {
      setLightboxIndex(index)
    }
  }

  const closeLightbox = () => setLightboxIndex(null)

  const goToPrevious = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }

  const goToNext = () => {
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  const styles = {
    title: { color: textColor || 'inherit' },
    muted: {
      color: mutedTextColor || 'inherit',
      opacity: mutedTextColor ? 1 : 0.7,
    },
  }

  return (
    <>
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
            // @ts-ignore
            containerRef.current = ref
          }
        }}
        className={isSelected ? 'ring-2 ring-primary rounded' : ''}
      >
        {title && (
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="h-5 w-5" style={styles.muted} />
            <h2 className="text-2xl font-bold" style={styles.title}>
              {title}
            </h2>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8" style={styles.muted}>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading gallery...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 py-4">{error}</p>
        ) : images.length === 0 ? (
          <div className="py-8 text-center" style={styles.muted}>
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>
              {isEditorMode 
                ? 'No images uploaded yet. Upload images in the admin media manager.'
                : 'No images in gallery.'}
            </p>
          </div>
        ) : (
          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${actualColumns}, minmax(0, 1fr))` }}
          >
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.file_url}
                  alt={image.file_name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {showLightbox && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goToPrevious() }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image */}
          <img
            src={images[lightboxIndex].file_url}
            alt={images[lightboxIndex].file_name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goToNext() }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

function GalleryGridSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  const columnOptions = [
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ]

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Content" defaultOpen>
        <div>
          <Label>Title</Label>
          <Input
            value={props.title || ''}
            onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
            className="mt-1"
            placeholder="Leave empty to hide"
          />
        </div>
        <div>
          <Label>Max Images</Label>
          <Input
            type="number"
            value={props.limit || 9}
            onChange={(e) => setProp((props: any) => (props.limit = parseInt(e.target.value) || 9))}
            className="mt-1"
            min={1}
            max={24}
          />
        </div>
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="checkbox"
            id="showLightbox"
            checked={props.showLightbox !== false}
            onChange={(e) => setProp((props: any) => (props.showLightbox = e.target.checked))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="showLightbox" className="text-sm">Enable lightbox on click</Label>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label className="text-sm font-medium">Columns</Label>
          <div className="flex gap-2 mt-2">
            {columnOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.columns = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.columns || 3) === option.value
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </SettingsAccordion>

      <SettingsAccordion title="Colors">
        <p className="text-xs text-muted-foreground mb-3">
          Leave empty to inherit from parent section
        </p>
        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((props: any) => (props.textColor = value))}
          placeholder="Inherit"
        />
        <ColorPicker
          label="Muted Text"
          value={props.mutedTextColor || ''}
          onChange={(value) => setProp((props: any) => (props.mutedTextColor = value))}
          placeholder="Inherit (70% opacity)"
        />
      </SettingsAccordion>
    </div>
  )
}

GalleryGrid.craft = {
  displayName: 'Gallery Grid',
  props: {
    title: 'Parish Gallery',
    limit: 9,
    columns: 3,
    showLightbox: true,
    textColor: '',
    mutedTextColor: '',
  },
  related: {
    settings: GalleryGridSettings,
  },
}