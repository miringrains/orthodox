'use client'

import { useNode } from '@craftjs/core'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

export function HeroSection({ title, subtitle, imageUrl }: HeroSectionProps) {
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
        relative py-20 bg-gradient-to-b from-primary/10 to-background
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
    >
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title || 'Welcome to Our Parish'}</h1>
          <p className="text-xl text-muted-foreground">{subtitle || 'Join us in worship and fellowship'}</p>
        </div>
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
      <div>
        <Label>Title</Label>
        <Input
          value={props.title || ''}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={props.subtitle || ''}
          onChange={(e) => setProp((props: any) => (props.subtitle = e.target.value))}
        />
      </div>
      <div>
        <Label>Background Image URL</Label>
        <Input
          value={props.imageUrl || ''}
          onChange={(e) => setProp((props: any) => (props.imageUrl = e.target.value))}
        />
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
  },
  related: {
    settings: HeroSectionSettings,
  },
}
