import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  const { data: member, error: memberError } = await supabase
    .from('User')
    .select(`
      id, 
      fullName, 
      email, 
      role,
      MembershipDetails (*)
    `)
    .eq('id', id)
    .eq('role', 'ACTIVE_MEMBER')
    .is('deletedAt', null)
    .single();

  if (memberError || !member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  return NextResponse.json(member, { status: 200 });
}