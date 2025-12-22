'use client'

import { useNode } from '@craftjs/core'
import React, { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { SettingsAccordion } from '../controls/SettingsAccordion'
import { ColorPicker } from '../controls/ColorPicker'
import { useAlignmentContext } from '../contexts/AlignmentContext'

interface ClippedImageProps {
  imageUrl: string
  clipShape: 'none' | 'circle' | 'oval' | 'hexagon' | 'diamond' | 'arch'
  width: string
  aspectRatio: '1:1' | '4:3' | '16:9' | 'auto'
  align: 'left' | 'center' | 'right' | 'inherit'
  borderWidth: number
  borderColor: string
}

const CLIP_PATHS = {
  none: 'none',
  circle: 'circle(50% at 50% 50%)',
  oval: 'ellipse(50% 40% at 50% 50%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  arch: 'inset(0 0 0 0 round 50% 50% 0 0)',
}

const ASPECT_RATIOS = {
  '1:1': { paddingBottom: '100%' },
  '4:3': { paddingBottom: '75%' },
  '16:9': { paddingBottom: '56.25%' },
  'auto': { paddingBottom: 'auto' },
}

export function ClippedImage({
  imageUrl = '',
  clipShape = 'none',
  width = '300px',
  aspectRatio = '1:1',
  align = 'inherit',
  borderWidth = 0,
  borderColor = '#000000',
}: ClippedImageProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  // Inherit alignment from context if align is 'inherit'
  const alignmentContext = useAlignmentContext()
  const effectiveAlign = align === 'inherit' ? alignmentContext.align : align

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const clipPath = CLIP_PATHS[clipShape]
  const aspectRatioStyle = ASPECT_RATIOS[aspectRatio]

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`flex ${alignClasses[effectiveAlign]} ${isSelected ? 'ring-2 ring-primary rounded p-1' : ''}`}
    >
      {imageUrl ? (
        <div
          style={{
            width: width,
            position: 'relative',
            clipPath: clipPath !== 'none' ? clipPath : undefined,
            border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
            borderRadius: clipShape === 'none' ? '8px' : undefined,
            overflow: clipShape === 'none' ? 'hidden' : 'visible',
          }}
        >
          {aspectRatio === 'auto' ? (
            <img
              src={imageUrl}
              alt="Clipped"
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          ) : (
            <div style={{ position: 'relative', paddingBottom: aspectRatioStyle.paddingBottom }}>
              <img
                src={imageUrl}
                alt="Clipped"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: clipPath !== 'none' ? clipPath : undefined }}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
          style={{ width, height: aspectRatio === 'auto' ? '200px' : undefined, ...aspectRatioStyle }}
        >
          <span className="text-sm text-gray-400">No image</span>
        </div>
      )}
    </div>
  )
}

function ClippedImageSettings() {
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
      const fileName = `pages/${page.parish_id}/${pageId}/clipped/${Date.now()}.${fileExt}`

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

  return (
    <div className="divide-y divide-gray-100">
      <SettingsAccordion title="Image" defaultOpen>
        <div>
          <Label className="text-sm font-medium">Image</Label>
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
                <img src={props.imageUrl} alt="Clipped" className="max-h-24 mx-auto rounded" />
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
      </SettingsAccordion>

      <SettingsAccordion title="Shape">
        <div>
          <Label className="text-sm font-medium">Clip Shape</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: 'None', value: 'none' },
              { label: 'Circle', value: 'circle' },
              { label: 'Oval', value: 'oval' },
              { label: 'Hexagon', value: 'hexagon' },
              { label: 'Diamond', value: 'diamond' },
              { label: 'Arch', value: 'arch' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.clipShape = option.value))}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.clipShape || 'none') === option.value
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
          <Label className="text-sm font-medium">Width</Label>
          <Input
            type="text"
            value={props.width || '300px'}
            onChange={(e) => setProp((p: any) => (p.width = e.target.value))}
            placeholder="300px"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">e.g., 300px, 50%, 400px</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Aspect Ratio</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: '1:1', value: '1:1' },
              { label: '4:3', value: '4:3' },
              { label: '16:9', value: '16:9' },
              { label: 'Auto', value: 'auto' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.aspectRatio = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.aspectRatio || '1:1') === option.value
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

      <SettingsAccordion title="Alignment">
        <div>
          <Label className="text-sm font-medium">Alignment</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Inherit', value: 'inherit' },
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.align = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.align || 'inherit') === option.value
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

      <SettingsAccordion title="Border">
        <div>
          <Label className="text-sm font-medium">Border Width</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={10}
              value={props.borderWidth ?? 0}
              onChange={(e) => setProp((p: any) => (p.borderWidth = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.borderWidth ?? 0}px</span>
              <span>10px</span>
            </div>
          </div>
        </div>

        {props.borderWidth > 0 && (
          <ColorPicker
            label="Border Color"
            value={props.borderColor || '#000000'}
            onChange={(value) => setProp((p: any) => (p.borderColor = value))}
          />
        )}
      </SettingsAccordion>
    </div>
  )
}

ClippedImage.craft = {
  displayName: 'Clipped Image',
  props: {
    imageUrl: '',
    clipShape: 'none',
    width: '300px',
    aspectRatio: '1:1',
    align: 'inherit',
    borderWidth: 0,
    borderColor: '#000000',
  },
  related: {
    settings: ClippedImageSettings,
  },
}

