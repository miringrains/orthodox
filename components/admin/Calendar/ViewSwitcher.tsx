'use client'

import { ViewMode } from './types'

interface ViewSwitcherProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const views: { value: ViewMode; label: string }[] = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'list', label: 'List' },
  ]

  return (
    <div className="inline-flex rounded-lg border border-stone-200 dark:border-neutral-700 p-1 bg-white dark:bg-neutral-800">
      {views.map((view) => (
        <button
          key={view.value}
          onClick={() => onViewChange(view.value)}
          className={`
            px-4 py-1.5 text-[13px] font-medium rounded-md transition-all
            ${currentView === view.value
              ? 'bg-stone-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
              : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-neutral-100'
            }
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}
