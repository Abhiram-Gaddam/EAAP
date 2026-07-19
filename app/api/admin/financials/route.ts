// src/app/api/admin/financials/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';

export async function GET() {
  const user = await verifyAdmin();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: transactions, error } = await supabase
      .from('Transaction')
      .select(`
        id, 
        amount, 
        transactionType, 
        paymentGatewayId, 
        paymentId,
        status, 
        date,
        userId,
        User ( fullName, email )
      `)
      .order('date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}