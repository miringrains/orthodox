'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export function FeastHighlight({
  feastName,
  date,
  description,
}: {
  feastName: string
  date: string
  description: string
}) {
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

