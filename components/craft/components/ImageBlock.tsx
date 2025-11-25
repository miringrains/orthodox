'use client'

import { useNode } from '@craftjs/core'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface ImageBlockProps {
  imageUrl?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

export function ImageBlock({ imageUrl, alt, caption, width, height, objectFit }: ImageBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  if (!imageUrl) {
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 bg-muted/10 min-h-[200px]
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
      >
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">No image uploaded</p>
          <p className="text-xs text-muted-foreground">Upload an image in the settings panel</p>
        </div>
      </div>
    )
  }

  const objectFitClass = objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'

  return (
    <figure
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`my-4 ${isSelected ? 'ring-2 ring-primary rounded-lg' : ''}`}
    >
      <div
        className="relative w-full rounded-lg overflow-hidden bg-muted"
        style={{ aspectRatio: `${width || 16}/${height || 9}` }}
      >
        <img
          src={imageUrl}
          alt={alt || 'Image'}
          className={`w-full h-full ${objectFitClass}`}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function ImageBlockSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))
  const params = useParams()
  const pageId = params.id as string
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('You must be logged in to upload images')
      }

      // Get page to find parish_id
      const { data: page } = await supabase
        .from('pages')
        .select('parish_id')
        .eq('id', pageId)
        .single()

      if (!page) {
        throw new Error('Page not found')
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `pages/${page.parish_id}/${pageId}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        // If bucket doesn't exist, provide helpful error
        if (uploadError.message?.includes('not found') || uploadError.message?.includes('bucket')) {
          throw new Error('Storage bucket "media" not found. Please create it in Supabase Storage settings.')
        }
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      // Update component with new image URL
      setProp((props: any) => {
        props.imageUrl = publicUrl
        props.alt = props.alt || file.name.replace(/\.[^/.]+$/, '')
      })

      // Optionally save to media_assets table
      await supabase.from('media_assets').insert({
        parish_id: page.parish_id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
        bucket_name: 'media'
      })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setUploadError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Upload Image</Label>
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </>
              )}
            </Button>
          </label>
        </div>
        {uploadError && (
          <p className="text-sm text-destructive mt-2">{uploadError}</p>
        )}
      </div>

      <div>
        <Label>Image URL</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={props.imageUrl || ''}
            onChange={(e) => setProp((props: any) => (props.imageUrl = e.target.value))}
            placeholder="Or paste image URL"
          />
          {props.imageUrl && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProp((props: any) => (props.imageUrl = ''))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {props.imageUrl && (
        <>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={props.alt || ''}
              onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label>Caption</Label>
            <Input
              value={props.caption || ''}
              onChange={(e) => setProp((props: any) => (props.caption = e.target.value))}
              placeholder="Optional caption"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Aspect Ratio Width</Label>
              <Input
                type="number"
                value={props.width || 16}
                onChange={(e) => setProp((props: any) => (props.width = parseInt(e.target.value) || 16))}
              />
            </div>
            <div>
              <Label>Aspect Ratio Height</Label>
              <Input
                type="number"
                value={props.height || 9}
                onChange={(e) => setProp((props: any) => (props.height = parseInt(e.target.value) || 9))}
              />
            </div>
          </div>
          <div>
            <Label>Image Fit</Label>
            <select
              value={props.objectFit || 'cover'}
              onChange={(e) => setProp((props: any) => (props.objectFit = e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}

ImageBlock.craft = {
  displayName: 'Image Block',
  props: {
    imageUrl: '',
    alt: 'Image',
    caption: '',
    width: 16,
    height: 9,
    objectFit: 'cover',
  },
  related: {
    settings: ImageBlockSettings,
  },
}
