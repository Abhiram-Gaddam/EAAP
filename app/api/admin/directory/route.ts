import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('User')
    .select(`
      id, 
      fullName, 
      email, 
      role,
      MembershipDetails (
        currentHospital,
        currentDesignation,
        cityDistrict,
        clinicalEmbryologyExpYrs
      )
    `)
    .eq('role', 'ACTIVE_MEMBER')
    .is('deletedAt', null)
    .order('fullName', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}