'use client'

import { useNode } from '@craftjs/core'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface GalleryGridProps {
  title?: string
  imageUrls?: { url: string }[]
}

export function GalleryGrid({ title, imageUrls }: GalleryGridProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={isSelected ? 'ring-2 ring-primary' : ''}
    >
      <h2 className="text-2xl font-bold mb-6">{title || 'Parish Gallery'}</h2>
      {imageUrls && imageUrls.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {imageUrls.map((img, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <img
                  src={img.url}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No images in gallery</p>
      )}
    </div>
  )
}

function GalleryGridSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Title</Label>
        <Input
          value={props.title || ''}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
        />
      </div>
    </div>
  )
}

GalleryGrid.craft = {
  displayName: 'Gallery Grid',
  props: {
    title: 'Parish Gallery',
    imageUrls: [],
  },
  related: {
    settings: GalleryGridSettings,
  },
}
