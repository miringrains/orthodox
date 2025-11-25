import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Orthodox Parish Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The digital home for Orthodox parishes. Build beautiful, reverent websites
            for your parish in minutes.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Beautiful Sites</CardTitle>
              <CardDescription>
                Orthodox-inspired designs that feel reverent and legitimate
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Easy Management</CardTitle>
              <CardDescription>
                No technical skills required. Update content in minutes.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Online Giving</CardTitle>
              <CardDescription>
                Secure donations and "light a candle" functionality built-in
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
