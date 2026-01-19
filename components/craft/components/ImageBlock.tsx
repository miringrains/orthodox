'use client'

import { useNode } from '@craftjs/core'
import React, { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { ColorPicker } from '../controls/ColorPicker'
import { SpacingControl } from '../controls/SpacingControl'
import { BorderControl } from '../controls/BorderControl'
import { ShadowControl } from '../controls/ShadowControl'

interface ImageBlockProps {
  imageUrl?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  padding?: { top: number; right: number; bottom: number; left: number }
  margin?: { top: number; right: number; bottom: number; left: number }
  boxShadow?: string
  backgroundColor?: string
}

export function ImageBlock({ 
  imageUrl, 
  alt, 
  caption, 
  width, 
  height, 
  objectFit,
  borderRadius = 0,
  borderWidth = 0,
  borderColor = '#000000',
  borderStyle = 'solid',
  padding = { top: 0, right: 0, bottom: 0, left: 0 },
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  boxShadow,
  backgroundColor,
}: ImageBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const objectFitClass = objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'
  const paddingStyle = `${padding?.top ?? 0}px ${padding?.right ?? 0}px ${padding?.bottom ?? 0}px ${padding?.left ?? 0}px`
  const marginStyle = `${margin?.top ?? 0}px ${margin?.right ?? 0}px ${margin?.bottom ?? 0}px ${margin?.left ?? 0}px`
  const borderStyleStr = borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none'

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
        style={{
          padding: paddingStyle,
          margin: marginStyle,
          borderRadius: `${borderRadius}px`,
          backgroundColor: backgroundColor || undefined,
        }}
      >
        <div className="text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm mb-2">No image uploaded</p>
          <p className="text-xs text-muted-foreground">Upload an image in the settings panel</p>
        </div>
      </div>
    )
  }

  return (
    <figure
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`my-4 ${isSelected ? 'ring-2 ring-primary rounded-lg' : ''}`}
      style={{
        margin: marginStyle,
      }}
    >
      <div
        className="relative w-full rounded-lg overflow-hidden bg-muted"
        style={{
          aspectRatio: `${width || 16}/${height || 9}`,
          borderRadius: `${borderRadius}px`,
          border: borderStyleStr,
          boxShadow: boxShadow || undefined,
          padding: paddingStyle,
          backgroundColor: backgroundColor || undefined,
        }}
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = async (file: File) => {
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

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploading(true)
    setUploadError('')
    setUploadProgress(0)

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

      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (uploadError) {
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

      setPreviewUrl(null)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setUploadError(error.message || 'Failed to upload image')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Upload Image</Label>
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {previewUrl ? (
            <div className="space-y-2">
              <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded" />
              <p className="text-sm text-muted-foreground">Preview</p>
            </div>
          ) : uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="text-sm">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click or drag image here</p>
            </div>
          )}
        </div>
        {uploadError && (
          <p className="text-sm text-destructive mt-2">{uploadError}</p>
        )}
      </div>

      {props.imageUrl && (
        <div>
          <Label>Current Image</Label>
          <div className="mt-2 relative">
            <img 
              src={props.imageUrl} 
              alt={props.alt || 'Preview'} 
              className="w-full h-32 object-cover rounded border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setProp((props: any) => (props.imageUrl = ''))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div>
        <Label>Alt Text</Label>
        <Input
          value={props.alt || ''}
          onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
          placeholder="Description of image"
        />
      </div>

      <div>
        <Label>Caption</Label>
        <Textarea
          value={props.caption || ''}
          onChange={(e) => setProp((props: any) => (props.caption = e.target.value))}
          placeholder="Optional caption for the image"
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
        <Select
          value={props.objectFit || 'cover'}
          onValueChange={(value) => setProp((props: any) => (props.objectFit = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ColorPicker
        label="Background Color"
        value={props.backgroundColor || ''}
        onChange={(value) => setProp((props: any) => (props.backgroundColor = value))}
        placeholder="Transparent"
      />

      <SpacingControl
        label="Padding"
        value={props.padding || { top: 0, right: 0, bottom: 0, left: 0 }}
        onChange={(value) => setProp((props: any) => (props.padding = value))}
      />

      <SpacingControl
        label="Margin"
        value={props.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
        onChange={(value) => setProp((props: any) => (props.margin = value))}
      />

      <BorderControl
        borderRadius={props.borderRadius || 0}
        borderWidth={props.borderWidth || 0}
        borderColor={props.borderColor || '#000000'}
        borderStyle={props.borderStyle || 'solid'}
        onBorderRadiusChange={(value) => setProp((props: any) => (props.borderRadius = value))}
        onBorderWidthChange={(value) => setProp((props: any) => (props.borderWidth = value))}
        onBorderColorChange={(value) => setProp((props: any) => (props.borderColor = value))}
        onBorderStyleChange={(value) => setProp((props: any) => (props.borderStyle = value))}
      />

      <ShadowControl
        value={props.boxShadow || 'none'}
        onChange={(value) => setProp((props: any) => (props.boxShadow = value))}
      />
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
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000000',
    borderStyle: 'solid',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    boxShadow: 'none',
    backgroundColor: '',
  },
  related: {
    settings: ImageBlockSettings,
  },
}