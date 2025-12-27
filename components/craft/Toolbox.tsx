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
  Sparkles,
  Cross,
  LayoutGrid,
  Frame
} from 'lucide-react'
import { TextBlock } from './components/TextBlock'
import { ImageBlock } from './components/ImageBlock'
import { ButtonBlock } from './components/ButtonBlock'
import { Heading } from './components/Heading'
import { HeroSection } from './components/HeroSection'
import { Navbar } from './components/Navbar'
import { Container } from './components/Container'
import { Section } from './components/Section'
import { TwoColumn } from './components/TwoColumn'
import { ThreeColumn } from './components/ThreeColumn'
import { Spacer } from './components/Spacer'
import { Divider } from './components/Divider'
import { SchedulePreview } from './components/SchedulePreview'
import { DonationPanel } from './components/DonationPanel'
import { NewsList } from './components/NewsList'
import { SermonCardGrid } from './components/SermonCardGrid'
import { GalleryGrid } from './components/GalleryGrid'
import { FeastHighlight } from './components/FeastHighlight'
// Orthodox-specific components
import { Triptych } from './components/Triptych'
import { FeastBanner } from './components/FeastBanner'
import { IconDisplay } from './components/IconDisplay'
import { CallToActionBar } from './components/CallToActionBar'
import { FloatingImageSection } from './components/FloatingImageSection'
import { ClippedImage } from './components/ClippedImage'
import { Navigation, Columns, Heading as HeadingIcon, Minus, Space, LayoutList } from 'lucide-react'

const components = [
  { name: 'Heading', icon: HeadingIcon, component: Heading, componentName: 'Heading', category: 'Basic' },
  { name: 'Text Block', icon: Type, component: TextBlock, componentName: 'TextBlock', category: 'Basic' },
  { name: 'Image', icon: Image, component: ImageBlock, componentName: 'ImageBlock', category: 'Basic' },
  { name: 'Button', icon: MousePointerClick, component: ButtonBlock, componentName: 'ButtonBlock', category: 'Basic' },
  { name: 'Clipped Image', icon: Image, component: ClippedImage, componentName: 'ClippedImage', category: 'Basic' },
  { name: 'Navbar', icon: Navigation, component: Navbar, componentName: 'Navbar', category: 'Layout' },
  { name: 'Container', icon: Layout, component: Container, componentName: 'Container', category: 'Layout' },
  { name: 'Section', icon: Layout, component: Section, componentName: 'Section', category: 'Layout' },
  { name: 'Hero Section', icon: Layout, component: HeroSection, componentName: 'HeroSection', category: 'Layout' },
  { name: 'Two Column', icon: Columns, component: TwoColumn, componentName: 'TwoColumn', category: 'Layout' },
  { name: 'Three Column', icon: Columns, component: ThreeColumn, componentName: 'ThreeColumn', category: 'Layout' },
  { name: 'Triptych', icon: LayoutGrid, component: Triptych, componentName: 'Triptych', category: 'Layout' },
  { name: 'Spacer', icon: Space, component: Spacer, componentName: 'Spacer', category: 'Layout' },
  { name: 'Divider', icon: Minus, component: Divider, componentName: 'Divider', category: 'Layout' },
  { name: 'CTA Bar', icon: LayoutList, component: CallToActionBar, componentName: 'CallToActionBar', category: 'Layout' },
  { name: 'Floating Image Section', icon: Layout, component: FloatingImageSection, componentName: 'FloatingImageSection', category: 'Layout' },
  { name: 'Icon Display', icon: Frame, component: IconDisplay, componentName: 'IconDisplay', category: 'Orthodox' },
  { name: 'Feast Banner', icon: Cross, component: FeastBanner, componentName: 'FeastBanner', category: 'Orthodox' },
  { name: 'Feast Highlight', icon: Sparkles, component: FeastHighlight, componentName: 'FeastHighlight', category: 'Orthodox' },
  { name: 'Schedule', icon: Calendar, component: SchedulePreview, componentName: 'SchedulePreview', category: 'Content' },
  { name: 'Donation', icon: DollarSign, component: DonationPanel, componentName: 'DonationPanel', category: 'Content' },
  { name: 'News List', icon: Megaphone, component: NewsList, componentName: 'NewsList', category: 'Content' },
  { name: 'Sermons', icon: Headphones, component: SermonCardGrid, componentName: 'SermonCardGrid', category: 'Content' },
  { name: 'Gallery', icon: Grid3x3, component: GalleryGrid, componentName: 'GalleryGrid', category: 'Content' },
]

const categories = ['Basic', 'Layout', 'Orthodox', 'Content']

export function Toolbox() {
  const { connectors } = useEditor()

  return (
    <div className="p-4 space-y-6">
      {categories.map((category) => {
        const categoryComponents = components.filter(c => c.category === category)
        return (
          <div key={category}>
            <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3 px-1">
              {category}
            </h3>
            <div className="space-y-1.5">
              {categoryComponents.map(({ name, icon: Icon, component: Component, componentName }) => {
                // Get default props from component's craft configuration
                const defaultProps = (Component as any).craft?.props || {}
                
                return (
                  <div
                    key={name}
                    ref={(ref) => {
                      if (ref && connectors) {
                        try {
                          // Create a draggable component element with default props
                          // Craft.js will resolve the component from the resolver using componentName
                          connectors.create(ref, React.createElement(Component as any, defaultProps))
                        } catch (error) {
                          console.error(`Error creating component ${componentName}:`, error)
                        }
                      }
                    }}
                    className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg hover:border-stone-400 hover:bg-white cursor-grab active:cursor-grabbing transition-all group"
                    draggable={false}
                  >
                    <div className="p-1.5 rounded-md bg-white border border-stone-200 group-hover:border-stone-300 transition-colors">
                      <Icon className="h-4 w-4 text-stone-500 group-hover:text-stone-700" />
                    </div>
                    <span className="text-[13px] font-medium text-stone-600 group-hover:text-stone-900 tracking-wide">{name}</span>
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
