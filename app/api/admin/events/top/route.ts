import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('Events')
    .select(`
      *,
      EventRegistrations ( id )
    `)
    .is('deletedAt', null)   
    .order('date', { ascending: false })
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedData = data.map((event: any) => ({
    ...event,
    registrationCount: event.EventRegistrations?.length || 0,
    EventRegistrations: undefined // Remove raw array from response
  }));

  return NextResponse.json(formattedData, { status: 200 });
}