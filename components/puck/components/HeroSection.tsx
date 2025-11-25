'use client'

import { Card, CardContent } from '@/components/ui/card'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

export function HeroSection(props: HeroSectionProps) {
  const { title = 'Welcome to Our Parish', subtitle = 'Join us in worship and fellowship', imageUrl = '' } = props
  return (
    <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </section>
  )
}

