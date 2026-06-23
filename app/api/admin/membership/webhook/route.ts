import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. Get the raw body as text for signature verification
    const textBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    if (!signature) {
      return NextResponse.json({ error: 'Missing Signature' }, { status: 400 });
    }

    // 2. Verify the Webhook Signature securely
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(textBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
    }

    // 3. Parse the body now that we know it's safe
    const event = JSON.parse(textBody);

    // 4. Handle the 'payment.captured' event
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;
      const rzpPaymentId = paymentEntity.id;

      // 4a. Find the matching Transaction in your DB
      const { data: txData, error: fetchError } = await supabase
        .from('Transaction')
        .select('id, userId, status')
        .eq('paymentGatewayId', rzpOrderId)
        .single();

      if (fetchError || !txData) {
        console.error('Transaction not found for Order:', rzpOrderId);
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }

      // If already processed, exit gracefully
      if (txData.status === 'SUCCESS') {
        return NextResponse.json({ message: 'Already processed' }, { status: 200 });
      }

      // 4b. Update Transaction status to SUCCESS
      const { error: txUpdateError } = await supabase
        .from('Transaction')
        .update({ status: 'SUCCESS' })
        .eq('id', txData.id);

      if (txUpdateError) throw txUpdateError;

      // 4c. Update or Insert MembershipDetails to PENDING_APPROVAL
      const { data: existingMembership } = await supabase
        .from('MembershipDetails')
        .select('id')
        .eq('userId', txData.userId)
        .single();

      if (existingMembership) {
        await supabase
          .from('MembershipDetails')
          .update({ status: 'PENDING_APPROVAL', updatedAt: new Date().toISOString() })
          .eq('userId', txData.userId);
      } else {
        await supabase
          .from('MembershipDetails')
          .insert([{
            userId: txData.userId,
            status: 'PENDING_APPROVAL',
            createdAt: new Date().toISOString()
          }]);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}