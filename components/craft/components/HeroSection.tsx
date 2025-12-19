'use client'

import { useNode, Element } from '@craftjs/core'
import React, { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { OpacityControl } from '../controls/OpacityControl'
import { ColorPicker } from '../controls/ColorPicker'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  overlayColor?: string
  overlayOpacity?: number
  textColor?: string
  padding?: number
  showTitle?: boolean
  showSubtitle?: boolean
  titleSize?: 'md' | 'lg' | 'xl' | '2xl'
  subtitleSize?: 'sm' | 'md' | 'lg'
  contentAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'center' | 'bottom'
  minHeight?: number
}

export function HeroSection({ 
  title, 
  subtitle, 
  imageUrl, 
  overlayColor = '#000000',
  overlayOpacity = 40,
  textColor = '#ffffff',
  padding = 120,
  showTitle = true,
  showSubtitle = true,
  titleSize = 'xl',
  subtitleSize = 'md',
  contentAlign = 'center',
  verticalAlign = 'center',
  minHeight = 500,
}: HeroSectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const titleSizeClasses = {
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
    '2xl': 'text-6xl md:text-7xl',
  }

  const subtitleSizeClasses = {
    sm: 'text-base md:text-lg',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  }

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const verticalAlignClasses = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  }

  return (
    <section
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        relative flex
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      style={{
        minHeight: `${minHeight}px`,
        paddingTop: `${padding}px`,
        paddingBottom: `${padding}px`,
      }}
    >
      {/* Background Image Layer */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {/* Overlay Layer */}
      <div
        className="absolute inset-0"
        style={{ 
          backgroundColor: overlayColor || '#000000',
          opacity: (overlayOpacity || 0) / 100,
        }}
      />
      
      {/* Content Layer */}
      <div 
        className={`container mx-auto px-4 relative z-10 flex flex-col ${verticalAlignClasses[verticalAlign]} ${alignClasses[contentAlign]}`}
        style={{ color: textColor || '#ffffff' }}
      >
        {(showTitle || showSubtitle) && (
          <div className={`mb-8 max-w-4xl ${alignClasses[contentAlign]}`}>
            {showTitle && (
              <h1 
                className={`${titleSizeClasses[titleSize]} font-bold mb-6 leading-tight`}
                style={{ fontFamily: 'serif' }}
              >
                {title || 'Welcome to Our Parish'}
              </h1>
            )}
            {showSubtitle && (
              <p className={`${subtitleSizeClasses[subtitleSize]} opacity-90 leading-relaxed max-w-2xl ${contentAlign === 'center' ? 'mx-auto' : ''}`}>
                {subtitle || 'Join us in worship and fellowship'}
              </p>
            )}
          </div>
        )}
        <Element is="div" canvas id="hero-content" className={`w-full flex flex-col ${alignClasses[contentAlign]}`}>
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

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (uploadErr) {
        if (uploadErr.message?.includes('not found') || uploadErr.message?.includes('bucket')) {
          throw new Error('Storage bucket "media" not found. Please create it in Supabase Storage settings.')
        }
        throw uploadErr
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
    <div className="divide-y divide-gray-100">
      {/* Content Section */}
      <SettingsAccordion title="Content" defaultOpen>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showTitle"
            checked={props.showTitle !== false}
            onCheckedChange={(checked) => setProp((p: any) => (p.showTitle = checked))}
          />
          <Label htmlFor="showTitle" className="text-sm">Show Title</Label>
        </div>

        {props.showTitle !== false && (
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <Input
              value={props.title || ''}
              onChange={(e) => setProp((p: any) => (p.title = e.target.value))}
              className="mt-1"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showSubtitle"
            checked={props.showSubtitle !== false}
            onCheckedChange={(checked) => setProp((p: any) => (p.showSubtitle = checked))}
          />
          <Label htmlFor="showSubtitle" className="text-sm">Show Subtitle</Label>
        </div>

        {props.showSubtitle !== false && (
          <div>
            <Label className="text-sm font-medium">Subtitle</Label>
            <Input
              value={props.subtitle || ''}
              onChange={(e) => setProp((p: any) => (p.subtitle = e.target.value))}
              className="mt-1"
            />
          </div>
        )}
      </SettingsAccordion>

      {/* Background Section */}
      <SettingsAccordion title="Background" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Background Image</Label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
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
                <img src={previewUrl} alt="Preview" className="max-h-24 mx-auto rounded" />
                <p className="text-xs text-gray-500">Uploading...</p>
              </div>
            ) : uploading ? (
              <div className="space-y-2">
                <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            ) : props.imageUrl ? (
              <div className="space-y-2">
                <img src={props.imageUrl} alt="Background" className="max-h-24 mx-auto rounded" />
                <p className="text-xs text-gray-500">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <ImageIcon className="h-6 w-6 mx-auto text-gray-400" />
                <p className="text-xs text-gray-500">Click or drag image</p>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-xs text-red-500 mt-1">{uploadError}</p>
          )}
          {props.imageUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setProp((p: any) => (p.imageUrl = ''))}
            >
              <X className="h-4 w-4 mr-1" />
              Remove Image
            </Button>
          )}
        </div>

        {/* Overlay controls - the user's mental model */}
        <ColorPicker
          label="Overlay Color"
          value={props.overlayColor || '#000000'}
          onChange={(value) => setProp((p: any) => (p.overlayColor = value))}
        />

        <OpacityControl
          label="Overlay Opacity"
          value={props.overlayOpacity ?? 40}
          onChange={(value) => setProp((p: any) => (p.overlayOpacity = value))}
        />

        <ColorPicker
          label="Text Color"
          value={props.textColor || '#ffffff'}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
        />
      </SettingsAccordion>

      {/* Typography Section */}
      <SettingsAccordion title="Typography">
        <div>
          <Label className="text-sm font-medium">Title Size</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'M', value: 'md' },
              { label: 'L', value: 'lg' },
              { label: 'XL', value: 'xl' },
              { label: '2XL', value: '2xl' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.titleSize = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.titleSize || 'xl') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Subtitle Size</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'S', value: 'sm' },
              { label: 'M', value: 'md' },
              { label: 'L', value: 'lg' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.subtitleSize = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.subtitleSize || 'md') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </SettingsAccordion>

      {/* Layout Section */}
      <SettingsAccordion title="Layout">
        <div>
          <Label className="text-sm font-medium">Content Alignment</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.contentAlign = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.contentAlign || 'center') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Vertical Position</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Top', value: 'top' },
              { label: 'Center', value: 'center' },
              { label: 'Bottom', value: 'bottom' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.verticalAlign = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.verticalAlign || 'center') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Minimum Height</Label>
          <div className="mt-2">
            <input
              type="range"
              min={300}
              max={800}
              step={50}
              value={props.minHeight || 500}
              onChange={(e) => setProp((p: any) => (p.minHeight = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>300px</span>
              <span className="font-medium text-gray-700">{props.minHeight || 500}px</span>
              <span>800px</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Vertical Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={40}
              max={200}
              value={props.padding || 120}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40px</span>
              <span className="font-medium text-gray-700">{props.padding || 120}px</span>
              <span>200px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>
    </div>
  )
}

HeroSection.craft = {
  displayName: 'Hero Section',
  props: {
    title: 'Welcome to Our Parish',
    subtitle: 'Join us in worship and fellowship',
    imageUrl: '',
    overlayColor: '#000000',
    overlayOpacity: 40,
    textColor: '#ffffff',
    padding: 120,
    showTitle: true,
    showSubtitle: true,
    titleSize: 'xl',
    subtitleSize: 'md',
    contentAlign: 'center',
    verticalAlign: 'center',
    minHeight: 500,
  },
  related: {
    settings: HeroSectionSettings,
  },
}
