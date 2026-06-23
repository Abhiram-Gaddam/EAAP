import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';

// Initialize the Razorpay instance using your server-side keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  // 1. Authenticate the user
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // 2. Define the payment parameters (Razorpay expects the amount in paise)
    const MEMBERSHIP_AMOUNT_INR = 1500;
    const amountInPaise = MEMBERSHIP_AMOUNT_INR * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_membership_${user.userId}_${Date.now()}`,
    };

    // 3. Ask Razorpay to create a secure order
    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Failed to generate Razorpay order' }, { status: 500 });
    }

    // 4. Log the pending transaction in your Supabase database
    const { error: dbError } = await supabase
      .from('Transaction')
      .insert([{
        userId: user.userId,
        amount: MEMBERSHIP_AMOUNT_INR,
        transactionType: 'MEMBERSHIP_FEE',
        paymentGatewayId: order.id, // Storing the rzp_order_id
        status: 'PENDING',
        date: new Date().toISOString()
      }]);

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return NextResponse.json({ error: 'Failed to log pending transaction' }, { status: 500 });
    }

    // 5. Return the essential order details to the frontend
    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Order Creation Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}