'use client'

import { useNode } from '@craftjs/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface FeastHighlightProps {
  feastName?: string
  date?: string
  description?: string
}

export function FeastHighlight({ feastName, date, description }: FeastHighlightProps) {
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
      className={`border-primary bg-primary/5 ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {feastName || 'Great Feast'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {date || new Date().toLocaleDateString()}
        </p>
        <p>{description || 'Join us in celebration'}</p>
      </CardContent>
    </Card>
  )
}

function FeastHighlightSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Feast Name</Label>
        <Input
          value={props.feastName || ''}
          onChange={(e) => setProp((props: any) => (props.feastName = e.target.value))}
        />
      </div>
      <div>
        <Label>Date</Label>
        <Input
          value={props.date || ''}
          onChange={(e) => setProp((props: any) => (props.date = e.target.value))}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={props.description || ''}
          onChange={(e) => setProp((props: any) => (props.description = e.target.value))}
        />
      </div>
    </div>
  )
}

FeastHighlight.craft = {
  displayName: 'Feast Highlight',
  props: {
    feastName: 'Great Feast',
    date: new Date().toLocaleDateString(),
    description: 'Join us in celebration',
  },
  related: {
    settings: FeastHighlightSettings,
  },
}
