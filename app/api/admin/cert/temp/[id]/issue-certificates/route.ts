// import { verifyAdmin } from '@/app/lib/utilities/auth';
// import { supabase } from '@/app/lib/utilities/supabase';
// import { NextResponse } from 'next/server'; 

// export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
//   const admin = await verifyAdmin();
//   if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

//   const { id } = await params;

//   try {
//     // 1. Try to read userIds from the request body
//     let selectedUserIds: string[] = [];
//     try {
//       const body = await request.json();
//       if (body && Array.isArray(body.userIds)) {
//         selectedUserIds = body.userIds;
//       }
//     } catch (e) {
//       // If no body is sent, it just falls back to the old behavior
//     }

//     // 2. If the frontend sent a list of users, mark them ALL as attended first
//     if (selectedUserIds.length > 0) {
//       const { error: attendanceError } = await supabase
//         .from('EventRegistrations')
//         .update({ attended: true })
//         .eq('eventId', id)
//         .in('userId', selectedUserIds); // .in() updates multiple rows at once

//       if (attendanceError) throw attendanceError;
//     }

//     // 3. Mark the event as issued
//     const { data: event, error: eventError } = await supabase
//       .from('Events')
//       .update({ certificatesIssued: true })
//       .eq('id', id)
//       .select('title')
//       .single();

//     if (eventError) throw eventError;

//     // 4. Fetch the final count of everyone who actually got a certificate
//     const { data: attendees, error: attendeesError } = await supabase
//       .from('EventRegistrations')
//       .select('userId, User(email, fullName)')
//       .eq('eventId', id)
//       .eq('attended', true);

//     if (attendeesError) throw attendeesError;

//     return NextResponse.json({ 
//       message: 'Certificates successfully issued to selected attendees', 
//       issuedCount: attendees?.length || 0 
//     }, { status: 200 });

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const { error: attendanceError } = await supabase
      .from('EventRegistrations')
      .update({ attended: true })
      .eq('eventId', id);

    if (attendanceError) throw attendanceError;

    const { error: eventError } = await supabase
      .from('Events')
      .update({ certificatesIssued: true })
      .eq('id', id);

    if (eventError) throw eventError;

    const { data: attendees, error: attendeesError } = await supabase
      .from('EventRegistrations')
      .select('id')
      .eq('eventId', id)
      .eq('attended', true);

    if (attendeesError) throw attendeesError;

    return NextResponse.json({ 
      message: 'Certificates successfully issued to all registered attendees', 
      issuedCount: attendees?.length || 0 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}