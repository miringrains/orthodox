'use client'

import { Editor, Frame } from '@craftjs/core'
import { craftComponents } from './components'

interface CraftRendererProps {
  content?: any
}

export function CraftRenderer({ content }: CraftRendererProps) {
  if (!content) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-muted-foreground">
          <p>No content available for this page.</p>
        </div>
      </div>
    )
  }

  try {
    return (
      <Editor enabled={false} resolver={craftComponents}>
        <Frame data={content} />
      </Editor>
    )
  } catch (error) {
    console.error('Error rendering Craft.js content:', error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-destructive">
          <p>An error occurred while rendering this page. Please try again later.</p>
        </div>
      </div>
    )
  }
}

