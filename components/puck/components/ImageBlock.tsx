'use client'

interface ImageBlockProps {
  imageUrl?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
}

export function ImageBlock(props: ImageBlockProps) {
  const { 
    imageUrl = '', 
    alt = 'Image', 
    caption = '',
    width = 16,
    height = 9,
    objectFit = 'cover'
  } = props

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 bg-muted/10">
        <p className="text-muted-foreground text-sm">No image URL provided</p>
      </div>
    )
  }

  const objectFitClass = objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'

  return (
    <figure className="my-4">
      <div 
        className="relative w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <img
          src={imageUrl}
          alt={alt}
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

