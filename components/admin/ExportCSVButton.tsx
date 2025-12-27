'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface Donation {
  id: string
  amount: number
  currency: string | null
  created_at: string | null
  status: string | null
  donation_funds?: { name: string } | null
  parishes?: { name: string } | null
}

export function ExportCSVButton({ donations }: { donations: Donation[] }) {
  const exportToCSV = () => {
    if (!donations || donations.length === 0) return

    const headers = ['Date', 'Amount', 'Currency', 'Fund', 'Parish', 'Status']
    const rows = donations.map((d) => [
      new Date(d.created_at || '').toLocaleDateString(),
      d.amount,
      d.currency || 'USD',
      (d.donation_funds as any)?.name || 'General',
      (d.parishes as any)?.name || 'Unknown',
      d.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!donations || donations.length === 0) return null

  return (
    <Button onClick={exportToCSV}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  )
}


