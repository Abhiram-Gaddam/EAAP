//  eaap/app/api/admin/membership/create-order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const MEMBERSHIP_AMOUNT_INR = 1500;
    const amountInPaise = MEMBERSHIP_AMOUNT_INR * 100;

    // Hardcoded brief receipt format to guarantee length remains well below 40 characters
    const shortReceiptId = `r_${Date.now()}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: shortReceiptId,
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Failed to generate Razorpay order' }, { status: 500 });
    }

    const { error: dbError } = await supabase
      .from('Transaction')
      .insert([{
        userId: user.userId,
        amount: MEMBERSHIP_AMOUNT_INR,
        transactionType: 'ADMISSION',
        paymentGatewayId: order.id,
        status: 'PENDING',
        date: new Date().toISOString()
      }]);

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return NextResponse.json({ error: 'Failed to log pending transaction' }, { status: 500 });
    }

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