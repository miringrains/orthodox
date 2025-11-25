'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SermonCardGrid({ title, limit }: { title: string; limit: number }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: limit }).map((_, i) => (
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

