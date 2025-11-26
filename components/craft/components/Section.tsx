'use client'

import { useNode, Element } from '@craftjs/core'
import React, { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { OpacityControl } from '../controls/OpacityControl'
import { DropZoneContent } from './shared/DropZone'

interface SectionProps {
  imageUrl?: string
  overlayColor?: string
  overlayOpacity?: number
  textColor?: string
  padding?: number
  containerWidth?: string
}

export function Section({
  imageUrl = '',
  overlayColor = '',
  overlayOpacity = 0,
  textColor = '',
  padding = 60,
  containerWidth = '1200px',
}: SectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

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
        paddingTop: `${padding}px`,
        paddingBottom: `${padding}px`,
      }}
    >
      {/* Background Image Layer - always full opacity */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      
      {/* Overlay Layer - controls visibility of image */}
      {(overlayColor || imageUrl) && (
        <div
          className="absolute inset-0"
          style={{ 
            backgroundColor: overlayColor || '#000000',
            opacity: overlayOpacity / 100,
          }}
        />
      )}

      {/* Content Layer */}
      <div 
        className="relative z-10 mx-auto px-4"
        style={{ 
          maxWidth: containerWidth,
          color: textColor || undefined,
        }}
      >
        <Element 
          is={DropZoneContent} 
          canvas 
          id="section-content"
          placeholder="Drop components here"
          minHeight={80}
        />
      </div>
    </section>
  )
}

function SectionSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))
  const params = useParams()
  const pageId = params.id as string
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploading(true)
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
      const fileName = `pages/${page.parish_id}/${pageId}/section/${Date.now()}.${fileExt}`

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
        props.imageUrl = publicUrl
      })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setUploadError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const widthOptions = [
    { label: 'SM', value: '640px' },
    { label: 'MD', value: '768px' },
    { label: 'LG', value: '1024px' },
    { label: 'XL', value: '1200px' },
    { label: 'Full', value: '100%' },
  ]

  return (
    <div className="divide-y divide-gray-100">
      {/* Layout Section */}
      <SettingsAccordion title="Layout" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Content Width</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {widthOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.containerWidth = option.value))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.containerWidth || '1200px') === option.value
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
          <Label className="text-sm font-medium">Vertical Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={200}
              value={props.padding ?? 60}
              onChange={(e) => setProp((p: any) => (p.padding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.padding ?? 60}px</span>
              <span>200px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>

      {/* Background Section */}
      <SettingsAccordion title="Background">
        <div>
          <Label className="text-sm font-medium">Background Image</Label>
          <div
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
            {uploading ? (
              <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
            ) : props.imageUrl ? (
              <div className="space-y-2">
                <img src={props.imageUrl} alt="Background" className="max-h-24 mx-auto rounded" />
                <p className="text-xs text-gray-500">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <ImageIcon className="h-6 w-6 mx-auto text-gray-400" />
                <p className="text-xs text-gray-500">Click to upload</p>
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

        <ColorPicker
          label="Overlay Color"
          value={props.overlayColor || ''}
          onChange={(value) => setProp((p: any) => (p.overlayColor = value))}
          placeholder="none"
        />

        {(props.overlayColor || props.imageUrl) && (
          <OpacityControl
            label="Overlay Opacity"
            value={props.overlayOpacity ?? 0}
            onChange={(value) => setProp((p: any) => (p.overlayOpacity = value))}
          />
        )}

        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
          placeholder="inherit"
        />
      </SettingsAccordion>
    </div>
  )
}

Section.craft = {
  displayName: 'Section',
  props: {
    imageUrl: '',
    overlayColor: '',
    overlayOpacity: 0,
    textColor: '',
    padding: 60,
    containerWidth: '1200px',
  },
  related: {
    settings: SectionSettings,
  },
}
