'use client'

import { useNode } from '@craftjs/core'
import React, { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { Loader2, Image as ImageIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

/**
 * Icon Display Component
 * 
 * A component specifically designed for displaying Orthodox icons
 * with proper framing and reverent presentation.
 * 
 * Features:
 * - Border frame reminiscent of icon frames (riza)
 * - Optional caption for icon name/description
 * - Proper aspect ratio handling
 * - Optional gold-style border accent
 */

interface IconDisplayProps {
  imageUrl?: string
  caption?: string
  showCaption?: boolean
  frameColor?: string
  frameWidth?: number
  showFrame?: boolean
  captionColor?: string
  backgroundColor?: string
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
}

export function IconDisplay({
  imageUrl = '',
  caption = '',
  showCaption = true,
  frameColor = '#d4af37',
  frameWidth = 4,
  showFrame = true,
  captionColor = '#1f2937',
  backgroundColor = '',
  maxWidth = 300,
  align = 'center',
}: IconDisplayProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const alignClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`
        ${alignClasses[align]}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      style={{
        maxWidth: `${maxWidth}px`,
        backgroundColor: backgroundColor || undefined,
      }}
    >
      {/* Icon Frame */}
      <div
        className="overflow-hidden"
        style={{
          border: showFrame ? `${frameWidth}px solid ${frameColor}` : undefined,
          borderRadius: '2px',
          boxShadow: showFrame ? '0 4px 12px rgba(0,0,0,0.15)' : undefined,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={caption || 'Icon'}
            className="w-full h-auto block"
          />
        ) : (
          <div 
            className="aspect-[3/4] flex items-center justify-center bg-gray-100"
          >
            <div className="text-center text-gray-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Upload icon image</p>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {showCaption && caption && (
        <p
          className="mt-3 text-center text-sm italic"
          style={{ 
            color: captionColor,
            fontFamily: 'serif',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  )
}

function IconDisplaySettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))
  const params = useParams()
  const pageId = params.id as string
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const fileName = `pages/${page.parish_id}/${pageId}/icons/${Date.now()}.${fileExt}`

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

      setProp((p: any) => (p.imageUrl = publicUrl))
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setUploadError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Icon Image" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Icon Image</Label>
          <div
            className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <Loader2 className="h-5 w-5 mx-auto animate-spin text-primary" />
            ) : props.imageUrl ? (
              <div className="space-y-2">
                <img src={props.imageUrl} alt="Icon" className="max-h-24 mx-auto" />
                <p className="text-xs text-gray-500">Click to change</p>
              </div>
            ) : (
              <div className="space-y-1 py-1">
                <ImageIcon className="h-5 w-5 mx-auto text-gray-400" />
                <p className="text-xs text-gray-500">Upload icon image</p>
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showCaption"
            checked={props.showCaption !== false}
            onChange={(e) => setProp((p: any) => (p.showCaption = e.target.checked))}
            className="rounded"
          />
          <Label htmlFor="showCaption" className="text-sm">Show Caption</Label>
        </div>

        {props.showCaption !== false && (
          <div>
            <Label className="text-sm font-medium">Caption</Label>
            <Input
              value={props.caption || ''}
              onChange={(e) => setProp((p: any) => (p.caption = e.target.value))}
              placeholder="Icon of the Theotokos"
              className="mt-1"
            />
          </div>
        )}
      </SettingsAccordion>

      <SettingsAccordion title="Frame">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showFrame"
            checked={props.showFrame !== false}
            onChange={(e) => setProp((p: any) => (p.showFrame = e.target.checked))}
            className="rounded"
          />
          <Label htmlFor="showFrame" className="text-sm">Show Frame Border</Label>
        </div>

        {props.showFrame !== false && (
          <>
            <ColorPicker
              label="Frame Color"
              value={props.frameColor || '#d4af37'}
              onChange={(value) => setProp((p: any) => (p.frameColor = value))}
            />

            <div>
              <Label className="text-sm font-medium">Frame Width</Label>
              <div className="mt-2">
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={props.frameWidth || 4}
                  onChange={(e) => setProp((p: any) => (p.frameWidth = parseInt(e.target.value)))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Thin</span>
                  <span className="font-medium text-gray-700">{props.frameWidth || 4}px</span>
                  <span>Thick</span>
                </div>
              </div>
            </div>
          </>
        )}
      </SettingsAccordion>

      <SettingsAccordion title="Layout">
        <div>
          <Label className="text-sm font-medium">Alignment</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.align = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.align || 'center') === option.value
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
          <Label className="text-sm font-medium">Max Width</Label>
          <div className="mt-2">
            <input
              type="range"
              min={150}
              max={600}
              step={50}
              value={props.maxWidth || 300}
              onChange={(e) => setProp((p: any) => (p.maxWidth = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>150px</span>
              <span className="font-medium text-gray-700">{props.maxWidth || 300}px</span>
              <span>600px</span>
            </div>
          </div>
        </div>

        <ColorPicker
          label="Caption Color"
          value={props.captionColor || '#1f2937'}
          onChange={(value) => setProp((p: any) => (p.captionColor = value))}
        />
      </SettingsAccordion>
    </div>
  )
}

IconDisplay.craft = {
  displayName: 'Icon Display',
  props: {
    imageUrl: '',
    caption: '',
    showCaption: true,
    frameColor: '#d4af37',
    frameWidth: 4,
    showFrame: true,
    captionColor: '#1f2937',
    backgroundColor: '',
    maxWidth: 300,
    align: 'center',
  },
  related: {
    settings: IconDisplaySettings,
  },
}


