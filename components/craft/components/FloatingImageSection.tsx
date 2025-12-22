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
import { ColumnCanvas } from './shared/ColumnCanvas'
import { AlignmentProvider } from '../contexts/AlignmentContext'
import { SHADOWS } from '@/lib/design-tokens'

interface FloatingImageSectionProps {
  imageUrl: string
  topColor: string
  bottomColor: string
  imageWidth: string
  imagePosition: 'left' | 'center' | 'right'
  overlapAmount: number
  borderRadius: number
  shadow: 'none' | 'md' | 'lg' | 'xl'
  topPadding: number
  bottomPadding: number
  topContentAlign?: 'left' | 'center' | 'right'
  bottomContentAlign?: 'left' | 'center' | 'right'
}

export function FloatingImageSection({
  imageUrl = '',
  topColor = '#ffffff',
  bottomColor = '#f5f5f5',
  imageWidth = '400px',
  imagePosition = 'center',
  overlapAmount = 100,
  borderRadius = 8,
  shadow = 'lg',
  topPadding = 80,
  bottomPadding = 80,
  topContentAlign = 'center',
  bottomContentAlign = 'center',
}: FloatingImageSectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const shadowStyles = {
    none: 'none',
    md: SHADOWS.md,
    lg: SHADOWS.lg,
    xl: SHADOWS.xl,
  }

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
    >
      {/* Top Zone */}
      <div 
        style={{ 
          backgroundColor: topColor, 
          paddingTop: `${topPadding}px`, 
          paddingBottom: `${overlapAmount / 2}px` 
        }}
      >
        <div className="container mx-auto px-4">
          <AlignmentProvider align={topContentAlign}>
            <Element is={ColumnCanvas} canvas id="top-content" />
          </AlignmentProvider>
        </div>
      </div>

      {/* Floating Image */}
      {imageUrl && (
        <div 
          className={`flex ${positionClasses[imagePosition]} relative z-10`}
          style={{ 
            marginTop: `-${overlapAmount / 2}px`,
            marginBottom: `-${overlapAmount / 2}px`,
          }}
        >
          <div
            style={{
              width: imageWidth,
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              boxShadow: shadowStyles[shadow],
            }}
          >
            <img
              src={imageUrl}
              alt="Floating"
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* Bottom Zone */}
      <div 
        style={{ 
          backgroundColor: bottomColor, 
          paddingTop: `${overlapAmount / 2}px`, 
          paddingBottom: `${bottomPadding}px` 
        }}
      >
        <div className="container mx-auto px-4">
          <AlignmentProvider align={bottomContentAlign}>
            <Element is={ColumnCanvas} canvas id="bottom-content" />
          </AlignmentProvider>
        </div>
      </div>
    </section>
  )
}

function FloatingImageSectionSettings() {
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
      const fileName = `pages/${page.parish_id}/${pageId}/floating/${Date.now()}.${fileExt}`

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
          <Label className="text-sm font-medium">Floating Image</Label>
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
                <img src={props.imageUrl} alt="Floating" className="max-h-24 mx-auto rounded" />
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

        <div>
          <Label className="text-sm font-medium">Image Width</Label>
          <Input
            type="text"
            value={props.imageWidth || '400px'}
            onChange={(e) => setProp((p: any) => (p.imageWidth = e.target.value))}
            placeholder="400px"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">e.g., 400px, 50%, 60vw</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Image Position</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.imagePosition = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.imagePosition || 'center') === option.value
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
          <Label className="text-sm font-medium">Overlap Amount</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={200}
              value={props.overlapAmount ?? 100}
              onChange={(e) => setProp((p: any) => (p.overlapAmount = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.overlapAmount ?? 100}px</span>
              <span>200px</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Border Radius</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={50}
              value={props.borderRadius ?? 8}
              onChange={(e) => setProp((p: any) => (p.borderRadius = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.borderRadius ?? 8}px</span>
              <span>50px</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Shadow</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'None', value: 'none' },
              { label: 'MD', value: 'md' },
              { label: 'LG', value: 'lg' },
              { label: 'XL', value: 'xl' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.shadow = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.shadow || 'lg') === option.value
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

      <SettingsAccordion title="Colors">
        <ColorPicker
          label="Top Zone Color"
          value={props.topColor || '#ffffff'}
          onChange={(value) => setProp((p: any) => (p.topColor = value))}
        />
        <ColorPicker
          label="Bottom Zone Color"
          value={props.bottomColor || '#f5f5f5'}
          onChange={(value) => setProp((p: any) => (p.bottomColor = value))}
        />
      </SettingsAccordion>

      <SettingsAccordion title="Spacing">
        <div>
          <Label className="text-sm font-medium">Top Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={200}
              value={props.topPadding ?? 80}
              onChange={(e) => setProp((p: any) => (p.topPadding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.topPadding ?? 80}px</span>
              <span>200px</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Bottom Padding</Label>
          <div className="mt-2">
            <input
              type="range"
              min={0}
              max={200}
              value={props.bottomPadding ?? 80}
              onChange={(e) => setProp((p: any) => (p.bottomPadding = parseInt(e.target.value)))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span className="font-medium text-gray-700">{props.bottomPadding ?? 80}px</span>
              <span>200px</span>
            </div>
          </div>
        </div>
      </SettingsAccordion>
    </div>
  )
}

FloatingImageSection.craft = {
  displayName: 'Floating Image Section',
  props: {
    imageUrl: '',
    topColor: '#ffffff',
    bottomColor: '#f5f5f5',
    imageWidth: '400px',
    imagePosition: 'center',
    overlapAmount: 100,
    borderRadius: 8,
    shadow: 'lg',
    topPadding: 80,
    bottomPadding: 80,
    topContentAlign: 'center',
    bottomContentAlign: 'center',
  },
  related: {
    settings: FloatingImageSectionSettings,
  },
}

