'use client'

import React from 'react'
import { useEditor } from '@craftjs/core'
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
import { Navbar } from './components/Navbar'
import { SchedulePreview } from './components/SchedulePreview'
import { DonationPanel } from './components/DonationPanel'
import { NewsList } from './components/NewsList'
import { SermonCardGrid } from './components/SermonCardGrid'
import { GalleryGrid } from './components/GalleryGrid'
import { FeastHighlight } from './components/FeastHighlight'
import { Navigation } from 'lucide-react'

const components = [
  { name: 'Text Block', icon: Type, component: TextBlock, componentName: 'TextBlock', category: 'Basic' },
  { name: 'Image', icon: Image, component: ImageBlock, componentName: 'ImageBlock', category: 'Basic' },
  { name: 'Button', icon: MousePointerClick, component: ButtonBlock, componentName: 'ButtonBlock', category: 'Basic' },
  { name: 'Navbar', icon: Navigation, component: Navbar, componentName: 'Navbar', category: 'Layout' },
  { name: 'Hero Section', icon: Layout, component: HeroSection, componentName: 'HeroSection', category: 'Layout' },
  { name: 'Schedule', icon: Calendar, component: SchedulePreview, componentName: 'SchedulePreview', category: 'Content' },
  { name: 'Donation', icon: DollarSign, component: DonationPanel, componentName: 'DonationPanel', category: 'Content' },
  { name: 'News List', icon: Megaphone, component: NewsList, componentName: 'NewsList', category: 'Content' },
  { name: 'Sermons', icon: Headphones, component: SermonCardGrid, componentName: 'SermonCardGrid', category: 'Content' },
  { name: 'Gallery', icon: Grid3x3, component: GalleryGrid, componentName: 'GalleryGrid', category: 'Content' },
  { name: 'Feast', icon: Sparkles, component: FeastHighlight, componentName: 'FeastHighlight', category: 'Content' },
]

const categories = ['Basic', 'Layout', 'Content']

export function Toolbox() {
  const { connectors } = useEditor()

  return (
    <div className="p-4 space-y-6">
      {categories.map((category) => {
        const categoryComponents = components.filter(c => c.category === category)
        return (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
              {category}
            </h3>
            <div className="space-y-1">
              {categoryComponents.map(({ name, icon: Icon, component: Component, componentName }) => {
                // Get default props from component's craft configuration
                const defaultProps = (Component as any).craft?.props || {}
                
                return (
                  <div
                    key={name}
                    ref={(ref) => {
                      if (ref) {
                        // Create a new instance of the component with default props from craft config
                        connectors.create(ref, React.createElement(Component as any, defaultProps))
                      }
                    }}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 cursor-grab active:cursor-grabbing transition-all group"
                    draggable={false}
                  >
                    <div className="p-1.5 rounded bg-gray-100 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-gray-600 group-hover:text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
