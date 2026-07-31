// // api/admin/applications/[id]/status
// import { verifyAdmin } from '@/app/lib/utilities/auth';
// import { supabase } from '@/app/lib/utilities/supabase';
// import { NextResponse } from 'next/server';
  

// export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
//   const admin = await verifyAdmin();
//   if (!admin) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//   }

//   const { id } = await params;
//   const { status } = await request.json();

//   if (!['APPROVED', 'REJECTED'].includes(status)) {
//     return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
//   }

//   const { data: application, error: fetchError } = await supabase
//     .from('MembershipDetails')
//     .select('userId')
//     .eq('id', id)
//     .single();

//   if (fetchError || !application) {
//     return NextResponse.json({ error: 'Application not found' }, { status: 404 });
//   }

//   const { error: updateError } = await supabase
//     .from('MembershipDetails')
//     .update({ status })
//     .eq('id', id);

//   if (updateError) {
//     return NextResponse.json({ error: updateError.message }, { status: 500 });
//   }

//   if (status === 'APPROVED') {
//     await supabase
//       .from('User')
//       .update({ role: 'ACTIVE_MEMBER' })
//       .eq('id', application.userId);
//   }

//   // If status === 'REJECTED', the manual ₹1500 refund process is triggered by the agent outside the system.

//   return NextResponse.json({ message: `Application ${status}` }, { status: 200 });
// }

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

  let updatePayload: { status: string; registrationNum?: string } = { status };

  if (status === 'APPROVED') {
    const currentYear = new Date().getFullYear();
    const prefix = `EAAP / LTM / ${currentYear} / `;

    const { data: latestRecords } = await supabase
      .from('MembershipDetails')
      .select('registrationNum')
      .like('registrationNum', `${prefix}%`)
      .order('registrationNum', { ascending: false })
      .limit(1);

    let nextSequence = 1;
    
    if (latestRecords && latestRecords.length > 0 && latestRecords[0].registrationNum) {
      const parts = latestRecords[0].registrationNum.split(' / ');
      const lastNumber = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastNumber)) {
        nextSequence = lastNumber + 1;
      }
    }

    updatePayload.registrationNum = `${prefix}${String(nextSequence).padStart(4, '0')}`;
  }

  const { error: updateError } = await supabase
    .from('MembershipDetails')
    .update(updatePayload)
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

  return NextResponse.json({ message: `Application ${status}` }, { status: 200 });
}