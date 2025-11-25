'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'

interface DonationPanelProps {
  title?: string
  description?: string
}

export function DonationPanel(props: DonationPanelProps) {
  const { title = 'Support Our Parish', description = 'Your generosity helps us serve our community' } = props
  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button asChild>
          <Link href="/giving">Donate Now</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

