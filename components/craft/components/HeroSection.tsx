'use client'

import { useNode, Element } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

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
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.backgroundColor || '#f0f9ff'}
            onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
            className="h-10 w-20"
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
        <Label>Background Image URL</Label>
        <Input
          value={props.imageUrl || ''}
          onChange={(e) => setProp((props: any) => (props.imageUrl = e.target.value))}
          placeholder="https://example.com/image.jpg"
        />
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
