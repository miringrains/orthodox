'use client'

import { Render } from '@measured/puck'
import { config } from './registry'

export function PuckRenderer({ data }: { data: any }) {
  // Handle missing or invalid data gracefully
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-muted-foreground">
          <p>No content available for this page.</p>
        </div>
      </div>
    )
  }

  // Ensure data has the expected structure
  if (typeof data !== 'object' || (!data.content && !data.root)) {
    console.warn('Invalid Puck data structure:', data)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-muted-foreground">
          <p>Unable to render page content. Please check the page configuration.</p>
        </div>
      </div>
    )
  }

  try {
    return <Render config={config} data={data} />
  } catch (error) {
    console.error('Error rendering Puck content:', error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-destructive">
          <p>An error occurred while rendering this page. Please try again later.</p>
        </div>
      </div>
    )
  }
}

