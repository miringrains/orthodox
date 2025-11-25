import { createClient } from '@/lib/supabase/server'
import { getParishIdFromSlug } from '@/lib/tenancy'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Candle } from 'lucide-react'

export default async function GivingPage({
  params,
}: {
  params: Promise<{ 'parish-slug': string }>
}) {
  const { 'parish-slug': slug } = await params
  const parishId = await getParishIdFromSlug(slug)

  if (!parishId) {
    return <div>Parish not found</div>
  }

  const supabase = await createClient()
  const { data: funds } = await supabase
    .from('donation_funds')
    .select('*')
    .eq('parish_id', parishId)
    .order('is_default', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Support Our Parish</h1>

      {/* Light a Candle */}
      <Card className="mb-8 border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Candle className="h-6 w-6 text-primary" />
            <CardTitle>Light a Candle</CardTitle>
          </div>
          <CardDescription>
            Light a candle with an intention for a loved one or special need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/p/${slug}/giving/candle`}>Light a Candle</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Donation Funds */}
      {funds && funds.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Donation Funds</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {funds.map((fund) => (
              <Card key={fund.id}>
                <CardHeader>
                  <CardTitle>{fund.name}</CardTitle>
                  {fund.description && (
                    <CardDescription>{fund.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/p/${slug}/giving/donate?fund=${fund.id}`}>
                      Donate to {fund.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Donation options will be available soon.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

