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
import { ColumnCanvas } from './shared/ColumnCanvas'
import { AlignmentProvider } from '../contexts/AlignmentContext'

interface SectionProps {
  imageUrl?: string
  overlayColor?: string
  overlayOpacity?: number
  textColor?: string
  padding?: number
  containerWidth?: string
  contentAlign?: 'left' | 'center' | 'right'
  // Border styling (inspired by illuminated manuscripts)
  borderTop?: boolean
  borderBottom?: boolean
  borderColor?: string
  borderThickness?: number
  borderStyle?: 'single' | 'double' | 'ornate'
  // Background options
  backgroundType?: 'solid' | 'gradient' | 'image'
  gradientDirection?: 'to-bottom' | 'to-right' | 'to-bottom-right'
  gradientStartColor?: string
  gradientEndColor?: string
  // Shape dividers
  shapeDividerTop?: 'none' | 'wave' | 'angle' | 'curve'
  shapeDividerBottom?: 'none' | 'wave' | 'angle' | 'curve'
  shapeDividerColor?: string
}

export function Section({
  imageUrl = '',
  overlayColor = '',
  overlayOpacity = 0,
  textColor = '',
  padding = 60,
  containerWidth = '1200px',
  contentAlign = 'left',
  borderTop = false,
  borderBottom = false,
  borderColor = '#C9A227',
  borderThickness = 2,
  borderStyle = 'single',
  backgroundType = 'solid',
  gradientDirection = 'to-bottom',
  gradientStartColor = '',
  gradientEndColor = '',
  shapeDividerTop = 'none',
  shapeDividerBottom = 'none',
  shapeDividerColor = '#ffffff',
}: SectionProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  // Shape divider paths
  const SHAPE_DIVIDERS = {
    wave: 'M0,0 C150,50 350,0 500,0 L500,50 L0,50 Z',
    angle: 'M0,50 L500,0 L500,50 Z',
    curve: 'M0,50 Q250,0 500,50 L500,50 L0,50 Z',
  }

  // Render shape divider SVG
  const renderShapeDivider = (position: 'top' | 'bottom') => {
    const shape = position === 'top' ? shapeDividerTop : shapeDividerBottom
    if (shape === 'none') return null

    const path = SHAPE_DIVIDERS[shape]
    const isTop = position === 'top'
    
    return (
      <div 
        className="absolute left-0 right-0"
        style={{ 
          [isTop ? 'top' : 'bottom']: 0,
          height: '50px',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <svg
          width="100%"
          height="50"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <path
            d={path}
            fill={shapeDividerColor}
            transform={isTop ? 'scale(1, 1)' : 'scale(1, -1) translate(0, -50)'}
          />
        </svg>
      </div>
    )
  }

  // Compute background style
  const getBackgroundStyle = (): React.CSSProperties => {
    if (backgroundType === 'gradient' && gradientStartColor && gradientEndColor) {
      const directionMap = {
        'to-bottom': 'to bottom',
        'to-right': 'to right',
        'to-bottom-right': 'to bottom right',
      }
      return {
        background: `linear-gradient(${directionMap[gradientDirection]}, ${gradientStartColor}, ${gradientEndColor})`,
      }
    }
    if (backgroundType === 'image' && imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    return {}
  }

  // Render border based on style
  const renderBorder = () => {
    if (borderStyle === 'single') {
      return <div style={{ borderTop: `${borderThickness}px solid ${borderColor}` }} />
    }
    if (borderStyle === 'double') {
      return (
        <div>
          <div style={{ borderTop: `${borderThickness}px solid ${borderColor}` }} />
          <div style={{ height: '4px' }} />
          <div style={{ borderTop: `${borderThickness}px solid ${borderColor}` }} />
        </div>
      )
    }
    if (borderStyle === 'ornate') {
      return (
        <div>
          <div style={{ borderTop: `1px solid ${borderColor}`, opacity: 0.5 }} />
          <div style={{ height: '4px' }} />
          <div style={{ borderTop: `${Math.max(2, borderThickness)}px solid ${borderColor}` }} />
          <div style={{ height: '4px' }} />
          <div style={{ borderTop: `1px solid ${borderColor}`, opacity: 0.5 }} />
        </div>
      )
    }
    return null
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
      style={getBackgroundStyle()}
    >
      {/* Top Shape Divider */}
      {renderShapeDivider('top')}

      {/* Top Border */}
      {borderTop && renderBorder()}

      <div style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}>
        {/* Background Image Layer - only if backgroundType is 'image' */}
        {backgroundType === 'image' && imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        
        {/* Overlay Layer - controls visibility of image */}
        {backgroundType === 'image' && (overlayColor || imageUrl) && (
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
          <AlignmentProvider align={contentAlign}>
            <Element is={ColumnCanvas} canvas id="section-content" />
          </AlignmentProvider>
        </div>
      </div>

      {/* Bottom Border */}
      {borderBottom && renderBorder()}

      {/* Bottom Shape Divider */}
      {renderShapeDivider('bottom')}
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
                  (props.contentAlign || 'left') === option.value
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
          <Label className="text-sm font-medium">Background Type</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Solid', value: 'solid' },
              { label: 'Gradient', value: 'gradient' },
              { label: 'Image', value: 'image' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.backgroundType = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.backgroundType || 'solid') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {(props.backgroundType || 'solid') === 'gradient' && (
          <>
            <div>
              <Label className="text-sm font-medium">Gradient Direction</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { label: '↓', value: 'to-bottom' },
                  { label: '→', value: 'to-right' },
                  { label: '↘', value: 'to-bottom-right' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProp((p: any) => (p.gradientDirection = option.value))}
                    className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                      (props.gradientDirection || 'to-bottom') === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <ColorPicker
              label="Start Color"
              value={props.gradientStartColor || ''}
              onChange={(value) => setProp((p: any) => (p.gradientStartColor = value))}
            />
            <ColorPicker
              label="End Color"
              value={props.gradientEndColor || ''}
              onChange={(value) => setProp((p: any) => (p.gradientEndColor = value))}
            />
          </>
        )}

        {(props.backgroundType || 'solid') === 'image' && (
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
        )}

        {(props.backgroundType || 'solid') === 'image' && (
          <>
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
          </>
        )}

        <ColorPicker
          label="Text Color"
          value={props.textColor || ''}
          onChange={(value) => setProp((p: any) => (p.textColor = value))}
          placeholder="inherit"
        />
      </SettingsAccordion>

      {/* Shape Dividers Section */}
      <SettingsAccordion title="Shape Dividers">
        <div>
          <Label className="text-sm font-medium">Top Divider</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'None', value: 'none' },
              { label: 'Wave', value: 'wave' },
              { label: 'Angle', value: 'angle' },
              { label: 'Curve', value: 'curve' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.shapeDividerTop = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.shapeDividerTop || 'none') === option.value
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
          <Label className="text-sm font-medium">Bottom Divider</Label>
          <div className="flex gap-2 mt-2">
            {[
              { label: 'None', value: 'none' },
              { label: 'Wave', value: 'wave' },
              { label: 'Angle', value: 'angle' },
              { label: 'Curve', value: 'curve' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProp((p: any) => (p.shapeDividerBottom = option.value))}
                className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                  (props.shapeDividerBottom || 'none') === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {((props.shapeDividerTop && props.shapeDividerTop !== 'none') || 
          (props.shapeDividerBottom && props.shapeDividerBottom !== 'none')) && (
          <ColorPicker
            label="Divider Color"
            value={props.shapeDividerColor || '#ffffff'}
            onChange={(value) => setProp((p: any) => (p.shapeDividerColor = value))}
          />
        )}
      </SettingsAccordion>

      {/* Border Section */}
      <SettingsAccordion title="Borders">
        <p className="text-xs text-muted-foreground mb-3">
          Add decorative borders inspired by illuminated manuscripts
        </p>
        
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="borderTop"
              checked={props.borderTop === true}
              onChange={(e) => setProp((p: any) => (p.borderTop = e.target.checked))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="borderTop" className="text-sm">Top Border</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="borderBottom"
              checked={props.borderBottom === true}
              onChange={(e) => setProp((p: any) => (p.borderBottom = e.target.checked))}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="borderBottom" className="text-sm">Bottom Border</Label>
          </div>
        </div>

        {(props.borderTop || props.borderBottom) && (
          <>
            <div className="mt-3">
              <Label className="text-sm font-medium">Border Style</Label>
              <div className="flex gap-2 mt-2">
                {[
                  { label: 'Single', value: 'single' },
                  { label: 'Double', value: 'double' },
                  { label: 'Ornate', value: 'ornate' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProp((p: any) => (p.borderStyle = option.value))}
                    className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                      (props.borderStyle || 'single') === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <ColorPicker
              label="Border Color"
              value={props.borderColor || '#C9A227'}
              onChange={(value) => setProp((p: any) => (p.borderColor = value))}
            />

            <div>
              <Label className="text-sm font-medium">Thickness</Label>
              <Input
                type="number"
                value={props.borderThickness || 2}
                onChange={(e) => setProp((p: any) => (p.borderThickness = parseInt(e.target.value) || 2))}
                className="mt-1"
                min={1}
                max={8}
              />
            </div>
          </>
        )}
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
    contentAlign: 'left',
    borderTop: false,
    borderBottom: false,
    borderColor: '#C9A227',
    borderThickness: 2,
    borderStyle: 'single',
    backgroundType: 'solid',
    gradientDirection: 'to-bottom',
    gradientStartColor: '',
    gradientEndColor: '',
    shapeDividerTop: 'none',
    shapeDividerBottom: 'none',
    shapeDividerColor: '#ffffff',
  },
  related: {
    settings: SectionSettings,
  },
}
