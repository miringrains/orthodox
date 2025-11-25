'use client'

interface TextBlockProps {
  content?: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function TextBlock(props: TextBlockProps) {
  const { content = 'Enter your text here', align = 'left', size = 'md' } = props
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={`${sizeClasses[size]} ${alignClasses[align]} py-4`}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  )
}

