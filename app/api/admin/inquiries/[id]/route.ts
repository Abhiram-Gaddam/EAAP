// src/app/api/admin/inquiries/[id]/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!['NEW', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Inquiries')
      .update({ status, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Inquiry status updated', inquiry: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const { error } = await supabase
      .from('Inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Inquiry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}