import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const textBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    if (!signature) {
      return NextResponse.json({ error: 'Missing Signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(textBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
    }

    const event = JSON.parse(textBody);

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;
      const rzpPaymentId = paymentEntity.id;

      const { data: txData, error: fetchError } = await supabase
        .from('Transaction')
        .select('id, userId, status')
        .eq('paymentGatewayId', rzpOrderId)
        .single();

      if (fetchError || !txData) {
        console.error('Transaction not found for Order:', rzpOrderId);
        // Still return 200 — returning 4xx causes Razorpay to retry forever
        return NextResponse.json({ message: 'Transaction not found' }, { status: 200 });
      }

      if (txData.status === 'SUCCESS') {
        return NextResponse.json({ message: 'Already processed' }, { status: 200 });
      }

      const { error: txUpdateError } = await supabase
        .from('Transaction')
        .update({ status: 'SUCCESS' ,paymentId: rzpPaymentId})
        .eq('id', txData.id);

      if (txUpdateError) throw txUpdateError;

      const { error: membershipError } = await supabase
        .from('MembershipDetails')
        .upsert(
          {
            userId: txData.userId,
            status: 'PENDING',
            updatedAt: new Date().toISOString(),
          },
          { onConflict: 'userId' }
        );

      if (membershipError) throw membershipError;
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    // Returning 500 tells Razorpay to retry — which is what you want on a real failure
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}