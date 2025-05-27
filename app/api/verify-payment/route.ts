import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
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
      hasPaid = payments.data.some(payment =>
        payment.status === "succeeded" &&
        payment.amount >= 499 // $4.99 minimum
      )
      if (hasPaid) break
    }
    return NextResponse.json({ hasPaid, email: user.email })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
