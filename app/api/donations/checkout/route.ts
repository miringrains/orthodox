import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Stub implementation - will be fully implemented when Stripe keys are added
export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { parishId, amount, fundId, projectId, communityNeedId, isCandle, candleCount, candleIntention, currency = 'USD' } = body

  if (!process.env.STRIPE_SECRET_KEY) {
    // Stub mode - create donation record with mock payment intent
    const { data: donation, error } = await supabase
      .from('donations')
      .insert({
        parish_id: parishId,
        amount,
        currency,
        fund_id: fundId,
        project_id: projectId,
        community_need_id: communityNeedId,
        is_candle: isCandle || false,
        candle_count: candleCount,
        candle_intention: candleIntention,
        status: 'completed',
        stripe_payment_intent_id: `mock_pi_${Date.now()}`,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      donation,
      paymentIntentId: donation.stripe_payment_intent_id,
    })
  }

  // Real implementation would create Stripe payment intent here
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const paymentIntent = await stripe.paymentIntents.create({...})

  return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
}


