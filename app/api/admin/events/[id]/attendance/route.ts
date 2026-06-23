import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { userId, attended } = body;

    if (!userId || typeof attended !== 'boolean') {
      return NextResponse.json({ error: 'Missing userId or attended status' }, { status: 400 });
    }

    // Update the attendance status for this specific user
    const { error: updateError } = await supabase
      .from('EventRegistrations')
      .update({ attended: attended })
      .eq('eventId', id)
      .eq('userId', userId);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      message: attended ? 'Marked as attended' : 'Marked as absent' 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}