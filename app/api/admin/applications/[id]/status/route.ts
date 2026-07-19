// api/admin/applications/[id]/status
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server';
  

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data: application, error: fetchError } = await supabase
    .from('MembershipDetails')
    .select('userId')
    .eq('id', id)
    .single();

  if (fetchError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from('MembershipDetails')
    .update({ status })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (status === 'APPROVED') {
    await supabase
      .from('User')
      .update({ role: 'ACTIVE_MEMBER' })
      .eq('id', application.userId);
  }

  // If status === 'REJECTED', the manual ₹1500 refund process is triggered by the agent outside the system.

  return NextResponse.json({ message: `Application ${status}` }, { status: 200 });
}