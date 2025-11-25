'use client'

import { useNode, Element } from '@craftjs/core'
import React, { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  backgroundColor?: string
  padding?: { top: number; right: number; bottom: number; left: number }
  showTitle?: boolean
  showSubtitle?: boolean
}

export function HeroSection({ 
  title, 
  subtitle, 
  imageUrl, 
  backgroundColor,
  padding = { top: 80, right: 0, bottom: 80, left: 0 },
  showTitle = true,
  showSubtitle = true,
}: HeroSectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const paddingStyle = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`

  return (
    <section
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        relative
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      style={{
        backgroundColor: backgroundColor || undefined,
        padding: paddingStyle,
      }}
    >
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="container mx-auto px-4 relative z-10">
        {(showTitle || showSubtitle) && (
          <div className="text-center mb-8">
            {showTitle && (
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {title || 'Welcome to Our Parish'}
              </h1>
            )}
            {showSubtitle && (
              <p className="text-xl text-muted-foreground">
                {subtitle || 'Join us in worship and fellowship'}
              </p>
            )}
          </div>
        )}
        <Element is="div" canvas id="hero-content">
          {/* Drop components here (buttons, images, etc.) */}
        </Element>
      </div>
    </section>
  )
}

function HeroSectionSettings() {
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
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

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
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('You must be logged in to upload images')
      }

      const { data: page } = await supabase
        .from('pages')
        .select('parish_id')
        .eq('id', pageId)
        .single()

      if (!page) {
        throw new Error('Page not found')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `pages/${page.parish_id}/${pageId}/hero/${Date.now()}.${fileExt}`

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

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

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      setProp((props: any) => {
        props.imageUrl = publicUrl
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="showTitle"
          checked={props.showTitle !== false}
          onCheckedChange={(checked) => setProp((props: any) => (props.showTitle = checked))}
        />
        <Label htmlFor="showTitle">Show Title</Label>
      </div>

      {props.showTitle !== false && (
        <div>
          <Label>Title</Label>
          <Input
            value={props.title || ''}
            onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showSubtitle"
          checked={props.showSubtitle !== false}
          onCheckedChange={(checked) => setProp((props: any) => (props.showSubtitle = checked))}
        />
        <Label htmlFor="showSubtitle">Show Subtitle</Label>
      </div>

      {props.showSubtitle !== false && (
        <div>
          <Label>Subtitle</Label>
          <Input
            value={props.subtitle || ''}
            onChange={(e) => setProp((props: any) => (props.subtitle = e.target.value))}
          />
        </div>
      )}

      <div>
        <Label>Background Image</Label>
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
          ) : props.imageUrl ? (
            <div className="space-y-2">
              <img src={props.imageUrl} alt="Background" className="max-h-32 mx-auto rounded" />
              <p className="text-sm text-muted-foreground">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click or drag image here</p>
            </div>
          )}
        </div>
        {uploadError && (
          <p className="text-sm text-destructive mt-2">{uploadError}</p>
        )}
        {props.imageUrl && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-2"
            onClick={() => setProp((props: any) => (props.imageUrl = ''))}
          >
            <X className="h-4 w-4 mr-2" />
            Remove Background Image
          </Button>
        )}
      </div>

      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.backgroundColor || '#f0f9ff'}
            onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
            className="h-10 w-20 cursor-pointer"
          />
          <Input
            type="text"
            value={props.backgroundColor || '#f0f9ff'}
            onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
            placeholder="#f0f9ff"
          />
        </div>
      </div>

      <div>
        <Label>Padding</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={props.padding?.top || 80}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, top: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={props.padding?.right || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, right: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={props.padding?.bottom || 80}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, bottom: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={props.padding?.left || 0}
              onChange={(e) => setProp((props: any) => ({
                ...props,
                padding: { ...props.padding, left: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

HeroSection.craft = {
  displayName: 'Hero Section',
  props: {
    title: 'Welcome to Our Parish',
    subtitle: 'Join us in worship and fellowship',
    imageUrl: '',
    backgroundColor: '#f0f9ff',
    padding: { top: 80, right: 0, bottom: 80, left: 0 },
    showTitle: true,
    showSubtitle: true,
  },
  related: {
    settings: HeroSectionSettings,
  },
}
