'use client'

import { useNode } from '@craftjs/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface DonationPanelProps {
  title?: string
  description?: string
}

export function DonationPanel({ title, description }: DonationPanelProps) {
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
      className={`border-primary ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {title || 'Support Our Parish'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {description || 'Your generosity helps us serve our community'}
        </p>
        <Button asChild>
          <Link href="/giving">Donate Now</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function DonationPanelSettings() {
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

DonationPanel.craft = {
  displayName: 'Donation Panel',
  props: {
    title: 'Support Our Parish',
    description: 'Your generosity helps us serve our community',
  },
  related: {
    settings: DonationPanelSettings,
  },
}
