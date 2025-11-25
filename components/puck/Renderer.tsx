'use client'

import { Render } from '@measured/puck'
import { config } from './registry'

export function PuckRenderer({ data }: { data: any }) {
  if (!data) return null
  return <Render config={config} data={data} />
}

