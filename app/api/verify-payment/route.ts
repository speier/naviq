import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { config } from "../../config"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-06-30.basil" })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  // If payment is disabled, return that payment is not required
  if (!config.payment.enabled) {
    return NextResponse.json({ hasPaid: true, email: "payment-disabled" })
  }

  try {
    const { userToken } = await req.json()
    // Verify Supabase user token
    const { data: { user }, error } = await supabase.auth.getUser(userToken)
    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    // Search Stripe for payments from this email
    const customers = await stripe.customers.search({
      query: `email:'${user.email}'`
    })
    let hasPaid = false
    for (const customer of customers.data) {
      // Check for successful payments
      const payments = await stripe.paymentIntents.list({
        customer: customer.id,
        limit: 10
      })
      hasPaid = payments.data.some((payment: any) =>
        payment.status === "succeeded" &&
        payment.amount >= config.payment.minimumAmount
      )
      if (hasPaid) break
    }
    return NextResponse.json({ hasPaid, email: user.email })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
