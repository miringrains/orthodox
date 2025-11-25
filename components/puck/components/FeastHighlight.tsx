'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface FeastHighlightProps {
  feastName?: string
  date?: string
  description?: string
}

export function FeastHighlight(props: FeastHighlightProps) {
  const { feastName = 'Great Feast', date = new Date().toLocaleDateString(), description = 'Join us in celebration' } = props
  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {feastName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{date}</p>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}

