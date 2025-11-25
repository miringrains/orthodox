'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SermonCardGridProps {
  title?: string
  limit?: number
}

export function SermonCardGrid(props: SermonCardGridProps) {
  const { title = 'Recent Sermons', limit = 3 } = props
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: limit || 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">Sermon {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sermon content will be displayed here
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

