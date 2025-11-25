'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ButtonBlockProps {
  text?: string
  url?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
  fullWidth?: boolean
}

export function ButtonBlock(props: ButtonBlockProps) {
  const { 
    text = 'Click me', 
    url = '#',
    variant = 'default',
    size = 'default',
    fullWidth = false
  } = props

  const button = (
    <Button variant={variant} size={size} className={fullWidth ? 'w-full' : ''}>
      {text}
    </Button>
  )

  if (url && url !== '#') {
    return (
      <div className="py-4">
        <Link href={url}>{button}</Link>
      </div>
    )
  }

  return <div className="py-4">{button}</div>
}

