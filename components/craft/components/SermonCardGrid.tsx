'use client'

import { useNode } from '@craftjs/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface SermonCardGridProps {
  title?: string
  limit?: number
}

export function SermonCardGrid({ title, limit }: SermonCardGridProps) {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((state) => ({
    isSelected: state.events.selected,
  }))

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={isSelected ? 'ring-2 ring-primary' : ''}
    >
      <h2 className="text-2xl font-bold mb-6">{title || 'Recent Sermons'}</h2>
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

function SermonCardGridSettings() {
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
        <Label>Limit</Label>
        <Input
          type="number"
          value={props.limit || 3}
          onChange={(e) => setProp((props: any) => (props.limit = parseInt(e.target.value) || 3))}
        />
      </div>
    </div>
  )
}

SermonCardGrid.craft = {
  displayName: 'Sermon Card Grid',
  props: {
    title: 'Recent Sermons',
    limit: 3,
  },
  related: {
    settings: SermonCardGridSettings,
  },
}
