import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    // 1. Verify it belongs to the user and isn't already submitted
    const { data: pub, error: checkError } = await supabase
      .from('Publications')
      .select('status')
      .eq('id', id)
      .eq('submittedBy', user.userId)
      .single();

    if (checkError || !pub) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    if (pub.status === 'PENDING' || pub.status === 'APPROVED') {
      return NextResponse.json({ error: 'Publication is already submitted or approved' }, { status: 400 });
    }

    // 2. Change status to PENDING so the admin can see it
    const { error: updateError } = await supabase
      .from('Publications')
      .update({ status: 'PENDING', updatedAt: new Date().toISOString() })
      .eq('id', id)
      .eq('submittedBy', user.userId);

    if (updateError) throw updateError;

    return NextResponse.json({ message: 'Successfully sent to Admin for verification' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}