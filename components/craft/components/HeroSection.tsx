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
import { useFontContext } from '../contexts/FontContext'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  backgroundColor?: string
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
  heroStyle?: 'centered' | 'fullImage' | 'split' | 'minimal' | 'circularImage'
  circularImageUrl?: string
}

// Preset configurations
const HERO_PRESETS = {
  centered: {
    contentAlign: 'center' as const,
    verticalAlign: 'center' as const,
    minHeight: 500,
    padding: 120,
    overlayOpacity: 40,
  },
  fullImage: {
    contentAlign: 'center' as const,
    verticalAlign: 'bottom' as const,
    minHeight: 600,
    padding: 80,
    overlayOpacity: 60,
  },
  split: {
    contentAlign: 'left' as const,
    verticalAlign: 'center' as const,
    minHeight: 500,
    padding: 100,
    overlayOpacity: 30,
  },
  minimal: {
    contentAlign: 'center' as const,
    verticalAlign: 'center' as const,
    minHeight: 400,
    padding: 160,
    overlayOpacity: 0,
  },
  circularImage: {
    contentAlign: 'center' as const,
    verticalAlign: 'center' as const,
    minHeight: 550,
    padding: 100,
    overlayOpacity: 40,
  },
}

export function HeroSection({ 
  title, 
  subtitle, 
  imageUrl, 
  backgroundColor = '',
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
  heroStyle = 'centered',
  circularImageUrl = '',
}: HeroSectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  // Use global font context instead of hardcoded serif
  const globalFonts = useFontContext()
  const effectiveFontFamily = globalFonts.fontFamily !== 'inherit' ? globalFonts.fontFamily : undefined

  // Apply preset values (user can still override)
  const preset = HERO_PRESETS[heroStyle] || HERO_PRESETS.centered
  const effectiveContentAlign = contentAlign || preset.contentAlign
  const effectiveVerticalAlign = verticalAlign || preset.verticalAlign
  const effectiveMinHeight = minHeight || preset.minHeight
  const effectivePadding = padding || preset.padding
  const effectiveOverlayOpacity = overlayOpacity !== undefined ? overlayOpacity : preset.overlayOpacity

  // Title sizes with tight line-height and negative letter-spacing for refinement
  const titleSizeClasses = {
    md: 'text-3xl md:text-4xl leading-tight',
    lg: 'text-4xl md:text-5xl leading-tight',
    xl: 'text-5xl md:text-6xl leading-tight',
    '2xl': 'text-6xl md:text-7xl leading-none',
  }

  // Negative letter-spacing for large titles looks more refined
  const titleLetterSpacing = {
    md: '-0.015em',
    lg: '-0.02em',
    xl: '-0.025em',
    '2xl': '-0.03em',
  }

  const subtitleSizeClasses = {
    sm: 'text-base md:text-lg leading-relaxed',
    md: 'text-lg md:text-xl leading-relaxed',
    lg: 'text-xl md:text-2xl leading-relaxed',
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

  // Split layout: image on right, text on left
  if (heroStyle === 'split' && imageUrl) {
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
          minHeight: `${effectiveMinHeight}px`,
          paddingTop: `${effectivePadding}px`,
          paddingBottom: `${effectivePadding}px`,
          backgroundColor: backgroundColor || undefined,
        }}
      >
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className={`flex flex-col ${alignClasses[effectiveContentAlign]}`} style={{ color: textColor || '#ffffff' }}>
              {(showTitle || showSubtitle) && (
                <div className={`mb-8 ${alignClasses[effectiveContentAlign]}`}>
                  {showTitle && (
                    <h1 
                      className={`${titleSizeClasses[titleSize]} font-bold mb-6`}
                      style={{ 
                        fontFamily: effectiveFontFamily,
                        letterSpacing: titleLetterSpacing[titleSize],
                      }}
                    >
                      {title || 'Welcome to Our Parish'}
                    </h1>
                  )}
                  {showSubtitle && (
                    <p className={`${subtitleSizeClasses[subtitleSize]} opacity-90 leading-relaxed`}>
                      {subtitle || 'Join us in worship and fellowship'}
                    </p>
                  )}
                </div>
              )}
              <Element is="div" canvas id="hero-content" className={`w-full flex flex-col ${alignClasses[effectiveContentAlign]}`}>
                {/* Drop components here */}
              </Element>
            </div>
            {/* Image */}
            <div className="relative">
              <div
                className="w-full h-96 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div
                className="absolute inset-0 rounded-lg"
                style={{ 
                  backgroundColor: overlayColor || '#000000',
                  opacity: effectiveOverlayOpacity / 100,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Circular image layout
  if (heroStyle === 'circularImage') {
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
          minHeight: `${effectiveMinHeight}px`,
          paddingTop: `${effectivePadding}px`,
          paddingBottom: `${effectivePadding}px`,
          backgroundColor: backgroundColor || undefined,
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
        {(imageUrl || effectiveOverlayOpacity > 0) && (
          <div
            className="absolute inset-0"
            style={{ 
              backgroundColor: overlayColor || '#000000',
              opacity: effectiveOverlayOpacity / 100,
            }}
          />
        )}
        
        {/* Content Layer */}
        <div 
          className={`container mx-auto px-4 relative z-10 flex flex-col ${verticalAlignClasses[effectiveVerticalAlign]} ${alignClasses[effectiveContentAlign]}`}
          style={{ color: textColor || '#ffffff' }}
        >
          {(showTitle || showSubtitle) && (
            <div className={`mb-8 max-w-4xl ${alignClasses[effectiveContentAlign]}`}>
              {showTitle && (
                <h1 
                  className={`${titleSizeClasses[titleSize]} font-bold mb-6`}
                  style={{ 
                    fontFamily: effectiveFontFamily,
                    letterSpacing: titleLetterSpacing[titleSize],
                  }}
                >
                  {title || 'Welcome to Our Parish'}
                </h1>
              )}
              {showSubtitle && (
                <p className={`${subtitleSizeClasses[subtitleSize]} opacity-90 leading-relaxed max-w-2xl ${effectiveContentAlign === 'center' ? 'mx-auto' : ''}`}>
                  {subtitle || 'Join us in worship and fellowship'}
                </p>
              )}
            </div>
          )}
          
          {/* Circular Image */}
          {(circularImageUrl || imageUrl) && (
            <div className="mb-8 flex justify-center">
              <div
                className="w-64 h-64 rounded-full bg-cover bg-center border-4 shadow-2xl"
                style={{ 
                  backgroundImage: `url(${circularImageUrl || imageUrl})`,
                  borderColor: textColor || '#ffffff',
                }}
              />
            </div>
          )}
          
          <Element is="div" canvas id="hero-content" className={`w-full flex flex-col ${alignClasses[effectiveContentAlign]}`}>
            {/* Drop components here */}
          </Element>
        </div>
      </section>
    )
  }

  // Default layouts (centered, fullImage, minimal)
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
        minHeight: `${effectiveMinHeight}px`,
        paddingTop: `${effectivePadding}px`,
        paddingBottom: `${effectivePadding}px`,
        backgroundColor: backgroundColor || (heroStyle === 'minimal' ? '#ffffff' : undefined),
      }}
    >
      {/* Background Image Layer */}
      {imageUrl && heroStyle !== 'minimal' && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {/* Overlay Layer - only show if there's an image or explicit opacity */}
      {heroStyle !== 'minimal' && (imageUrl || effectiveOverlayOpacity > 0) && (
        <div
          className="absolute inset-0"
          style={{ 
            backgroundColor: overlayColor || '#000000',
            opacity: effectiveOverlayOpacity / 100,
          }}
        />
      )}
      
      {/* Content Layer */}
      <div 
        className={`container mx-auto px-4 relative z-10 flex flex-col ${verticalAlignClasses[effectiveVerticalAlign]} ${alignClasses[effectiveContentAlign]}`}
        style={{ color: textColor || '#ffffff' }}
      >
        {(showTitle || showSubtitle) && (
          <div className={`mb-8 max-w-4xl ${alignClasses[effectiveContentAlign]}`}>
            {showTitle && (
              <h1 
                className={`${titleSizeClasses[titleSize]} font-bold mb-6`}
                style={{ 
                  fontFamily: effectiveFontFamily,
                  letterSpacing: titleLetterSpacing[titleSize],
                }}
              >
                {title || 'Welcome to Our Parish'}
              </h1>
            )}
            {showSubtitle && (
              <p className={`${subtitleSizeClasses[subtitleSize]} opacity-90 leading-relaxed max-w-2xl ${effectiveContentAlign === 'center' ? 'mx-auto' : ''}`}>
                {subtitle || 'Join us in worship and fellowship'}
              </p>
            )}
          </div>
        )}
        <Element is="div" canvas id="hero-content" className={`w-full flex flex-col ${alignClasses[effectiveContentAlign]}`}>
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

  const [uploadingCircular, setUploadingCircular] = useState(false)
  const [previewCircularUrl, setPreviewCircularUrl] = useState<string | null>(null)
  const circularFileInputRef = useRef<HTMLInputElement>(null)

  const handleCircularImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      setPreviewCircularUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploadingCircular(true)
    setUploadError('')

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
      const fileName = `pages/${page.parish_id}/${pageId}/hero/circular/${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      setProp((props: any) => {
        props.circularImageUrl = publicUrl
      })

      setPreviewCircularUrl(null)
    } catch (error: any) {
      console.error('Error uploading circular image:', error)
      setUploadError(error.message || 'Failed to upload image')
      setPreviewCircularUrl(null)
    } finally {
      setUploadingCircular(false)
    }
  }

  return (
    <div className="divide-y divide-gray-100">
      {/* Hero Style Preset - Most Important */}
      <SettingsAccordion title="Hero Style" defaultOpen>
        <div>
          <Label className="text-sm font-medium mb-2 block">Choose a Layout</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Centered', value: 'centered', desc: 'Classic centered text' },
              { label: 'Full Image', value: 'fullImage', desc: 'Dramatic background' },
              { label: 'Split', value: 'split', desc: 'Image + text side-by-side' },
              { label: 'Minimal', value: 'minimal', desc: 'Text only, spacious' },
              { label: 'Circular', value: 'circularImage', desc: 'Featured circular image' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  const preset = HERO_PRESETS[option.value as keyof typeof HERO_PRESETS]
                  setProp((p: any) => {
                    p.heroStyle = option.value
                    // Apply preset defaults
                    if (!p.contentAlign) p.contentAlign = preset.contentAlign
                    if (!p.verticalAlign) p.verticalAlign = preset.verticalAlign
                    if (!p.minHeight) p.minHeight = preset.minHeight
                    if (!p.padding) p.padding = preset.padding
                    if (p.overlayOpacity === undefined) p.overlayOpacity = preset.overlayOpacity
                  })
                }}
                className={`p-3 text-left rounded-md border transition-colors ${
                  (props.heroStyle || 'centered') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="font-medium text-xs">{option.label}</div>
                <div className={`text-xs mt-0.5 ${(props.heroStyle || 'centered') === option.value ? 'opacity-90' : 'text-gray-500'}`}>
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </SettingsAccordion>

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

      {/* Circular Image (only for circularImage style) */}
      {props.heroStyle === 'circularImage' && (
        <SettingsAccordion title="Circular Image" defaultOpen>
          <div>
            <Label className="text-sm font-medium">Circular Feature Image</Label>
            <div
              className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => circularFileInputRef.current?.click()}
            >
              <input
                ref={circularFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCircularImageUpload}
                disabled={uploadingCircular}
                className="hidden"
              />
              {previewCircularUrl ? (
                <div className="space-y-2">
                  <img src={previewCircularUrl} alt="Preview" className="max-h-24 mx-auto rounded-full" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              ) : uploadingCircular ? (
                <div className="space-y-2">
                  <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              ) : props.circularImageUrl ? (
                <div className="space-y-2">
                  <img src={props.circularImageUrl} alt="Circular" className="max-h-24 mx-auto rounded-full" />
                  <p className="text-xs text-gray-500">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <ImageIcon className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="text-xs text-gray-500">Click to upload circular image</p>
                </div>
              )}
            </div>
            {props.circularImageUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setProp((p: any) => (p.circularImageUrl = ''))}
              >
                <X className="h-4 w-4 mr-1" />
                Remove Circular Image
              </Button>
            )}
          </div>
        </SettingsAccordion>
      )}

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

        {/* Background Color - always visible, especially useful for minimal preset */}
        <ColorPicker
          label="Background Color"
          value={props.backgroundColor || ''}
          onChange={(value) => setProp((p: any) => (p.backgroundColor = value))}
          placeholder="Transparent"
        />

        {/* Overlay controls - for image-based heroes */}
        {props.imageUrl && (
          <>
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
          </>
        )}

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
    backgroundColor: '',
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
    heroStyle: 'centered',
    circularImageUrl: '',
  },
  related: {
    settings: HeroSectionSettings,
  },
}
