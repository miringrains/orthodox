import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// Stub implementation - will be fully implemented when Stripe keys are added
export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // Stub mode - log and return success
    console.log('Stripe webhook received (stub mode - Stripe not configured)')
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Real implementation would verify signature here
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

  const supabase = await createClient()

  // Parse event (in stub mode, we'll just log)
  try {
    const event = JSON.parse(body)

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update donation status
        if (event.data?.object?.id) {
          await supabase
            .from('donations')
            .update({ status: 'completed' })
            .eq('stripe_payment_intent_id', event.data.object.id)
        }
        break

      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', event.data?.object?.id)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

