'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function SchedulePreview({ title, showFullSchedule }: { title: string; showFullSchedule: boolean }) {
  // This would fetch actual schedule data in a real implementation
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Service schedule will be displayed here
        </p>
        {showFullSchedule && (
          <Link href="/schedule" className="text-primary text-sm hover:underline">
            View Full Schedule →
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

