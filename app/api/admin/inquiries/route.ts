// src/app/api/admin/inquiries/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let query = supabase
      .from('Inquiries')
      .select('id, name, email, subject, message, status, userId, createdAt, updatedAt')
      .order('createdAt', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter.toUpperCase());
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}