'use client'

import { useNode } from '@craftjs/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SchedulePreviewProps {
  title?: string
  showFullSchedule?: boolean
}

export function SchedulePreview({ title, showFullSchedule }: SchedulePreviewProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  return (
    <Card
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={isSelected ? 'ring-2 ring-primary' : ''}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title || 'Service Schedule'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Service schedule will be displayed here
        </p>
        {showFullSchedule !== false && (
          <Link href="/schedule" className="text-primary text-sm hover:underline">
            View Full Schedule →
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

function SchedulePreviewSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Title</Label>
        <Input
          value={props.title || ''}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
        />
      </div>
    </div>
  )
}

SchedulePreview.craft = {
  displayName: 'Schedule Preview',
  props: {
    title: 'Service Schedule',
    showFullSchedule: true,
  },
  related: {
    settings: SchedulePreviewSettings,
  },
}
