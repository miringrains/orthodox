'use client'

import { useNode } from '@craftjs/core'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ImageBlockProps {
  imageUrl?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

export function ImageBlock({ imageUrl, alt, caption, width, height, objectFit }: ImageBlockProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  if (!imageUrl) {
    return (
      <div
        ref={(ref) => {
          if (ref) {
            connect(drag(ref))
          }
        }}
        className={`
          flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 bg-muted/10
          ${isSelected ? 'ring-2 ring-primary' : ''}
        `}
      >
        <p className="text-muted-foreground text-sm">No image URL provided</p>
      </div>
    )
  }

  const objectFitClass = objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'

  return (
    <figure
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`my-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <div
        className="relative w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: `${width || 16}/${height || 9}` }}
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

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Image URL</Label>
        <Input
          value={props.imageUrl || ''}
          onChange={(e) => setProp((props: any) => (props.imageUrl = e.target.value))}
        />
      </div>
      <div>
        <Label>Alt Text</Label>
        <Input
          value={props.alt || ''}
          onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
        />
      </div>
      <div>
        <Label>Caption</Label>
        <Input
          value={props.caption || ''}
          onChange={(e) => setProp((props: any) => (props.caption = e.target.value))}
        />
      </div>
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
  },
  related: {
    settings: ImageBlockSettings,
  },
}
