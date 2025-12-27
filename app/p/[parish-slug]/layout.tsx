import { PublicLayout } from '@/components/layouts/PublicLayout'
import { getParishFromSlug } from '@/lib/tenancy'
import { notFound } from 'next/navigation'

export default async function ParishLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ 'parish-slug': string }>
}) {
  const { 'parish-slug': slug } = await params
  const parish = await getParishFromSlug(slug)

  if (!parish) {
    notFound()
  }

  return <PublicLayout parish={parish}>{children}</PublicLayout>
}

