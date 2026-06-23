import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 


export async function GET() {
  // const admin = true;
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('MembershipDetails')
    .select('id, status, userId, highestQualification ,createdAt,User(id, fullName, email)')
    .order('createdAt', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}