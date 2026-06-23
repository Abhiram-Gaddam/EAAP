// app/api/membership/verify-payment/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';

export async function POST(request: Request) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  // Verify the signature Razorpay sends back
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
  }

  // Update transaction + membership in DB
  const { data: txData } = await supabase
    .from('Transaction')
    .select('id, status')
    .eq('paymentGatewayId', razorpay_order_id)
    .single();

  if (!txData || txData.status === 'SUCCESS') {
    return NextResponse.json({ message: 'Already processed or not found' }, { status: 200 });
  }

  const { error: updateError } = await supabase
  .from('Transaction')
  .update({ status: 'SUCCESS',paymentId: razorpay_payment_id })           // only columns that actually exist
  
  .eq('id', txData.id);

    if (updateError) {
    console.error('Transaction update failed:', updateError);
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
    }

  // Upsert membership
  const { error: upsertError } = await supabase
  .from('MembershipDetails')
  .upsert(
    { userId: user.userId, status: 'PENDING', updatedAt: new Date().toISOString() },
    { onConflict: 'userId' }
  );

if (upsertError) {
  console.error('Membership upsert failed:', upsertError);
  return NextResponse.json({ error: 'Membership update failed' }, { status: 500 });
}

  return NextResponse.json({ success: true });
}