'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GalleryGridProps {
  title?: string
  imageUrls?: { url: string }[]
}

export function GalleryGrid(props: GalleryGridProps) {
  const { title = 'Parish Gallery', imageUrls = [] } = props
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
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

