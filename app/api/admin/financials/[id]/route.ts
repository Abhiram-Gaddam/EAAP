// src/app/api/admin/financials/[id]/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id: transactionId } = await params;

    const { data: transaction, error: txError } = await supabase
      .from('Transaction')
      .select(`
        id, amount, transactionType, paymentGatewayId, paymentId, status, date, userId,
        User ( id, fullName, email )
      `)
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    let membership = null;
    if (transaction.transactionType === 'ADMISSION' && transaction.status === 'SUCCESS') {
      const { data: memData } = await supabase
        .from('MembershipDetails')
        .select('id, status, certificateUrl, phone, cityDistrict, highestQualification, createdAt, updatedAt')
        .eq('userId', transaction.userId)
        .maybeSingle();
      
      membership = memData;
    }

    return NextResponse.json({
      transaction,
      membershipStatus: membership ? membership.status : 'NOT_APPLICABLE',
      certificateIssued: !!(membership && membership.certificateUrl),
      certificateUrl: membership?.certificateUrl || null,
      membershipDetails: membership
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}