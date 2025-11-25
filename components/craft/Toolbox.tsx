'use client'

import React from 'react'
import { useEditor } from '@craftjs/core'
import { Button } from '@/components/ui/button'
import { 
  Type, 
  Image, 
  MousePointerClick, 
  Layout, 
  Calendar, 
  DollarSign, 
  Megaphone,
  Headphones,
  Grid3x3,
  Sparkles
} from 'lucide-react'
import { TextBlock } from './components/TextBlock'
import { ImageBlock } from './components/ImageBlock'
import { ButtonBlock } from './components/ButtonBlock'
import { HeroSection } from './components/HeroSection'
import { SchedulePreview } from './components/SchedulePreview'
import { DonationPanel } from './components/DonationPanel'
import { NewsList } from './components/NewsList'
import { SermonCardGrid } from './components/SermonCardGrid'
import { GalleryGrid } from './components/GalleryGrid'
import { FeastHighlight } from './components/FeastHighlight'

const components = [
  { name: 'Text Block', icon: Type, component: TextBlock, componentName: 'TextBlock' },
  { name: 'Image', icon: Image, component: ImageBlock, componentName: 'ImageBlock' },
  { name: 'Button', icon: MousePointerClick, component: ButtonBlock, componentName: 'ButtonBlock' },
  { name: 'Hero Section', icon: Layout, component: HeroSection, componentName: 'HeroSection' },
  { name: 'Schedule', icon: Calendar, component: SchedulePreview, componentName: 'SchedulePreview' },
  { name: 'Donation', icon: DollarSign, component: DonationPanel, componentName: 'DonationPanel' },
  { name: 'News List', icon: Megaphone, component: NewsList, componentName: 'NewsList' },
  { name: 'Sermons', icon: Headphones, component: SermonCardGrid, componentName: 'SermonCardGrid' },
  { name: 'Gallery', icon: Grid3x3, component: GalleryGrid, componentName: 'GalleryGrid' },
  { name: 'Feast', icon: Sparkles, component: FeastHighlight, componentName: 'FeastHighlight' },
]

export function Toolbox() {
  const { connectors } = useEditor()

  return (
    <div className="p-4 space-y-2">
      {components.map(({ name, icon: Icon, component: Component, componentName }) => (
        <div
          key={name}
          ref={(ref) => {
            if (ref) {
              // Create a new instance of the component with default props
              connectors.create(ref, React.createElement(Component as any, {}))
            }
          }}
          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
          draggable={false}
        >
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{name}</span>
        </div>
      ))}
    </div>
  )
}

