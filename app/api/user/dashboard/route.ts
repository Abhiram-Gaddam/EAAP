import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';

export async function GET() {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [userRes, membershipRes, eventsRes, publicationsRes] = await Promise.all([
      supabase.from('User').select('fullName, email, createdAt').eq('id', user.userId).single(),
      supabase.from('MembershipDetails').select('status, phone').eq('userId', user.userId).maybeSingle(),
      supabase.from('EventRegistrations').select(`attended, Events(date, certificatesIssued)`).eq('userId', user.userId),
      supabase.from('Publications').select('status').eq('submittedBy', user.userId)
    ]);

    if (userRes.error) throw userRes.error;

    const now = new Date();
    let upcomingEventsCount = 0;
    let pastEventsCount = 0;
    let certificatesCount = 0;

    (eventsRes.data || []).forEach((reg: any) => {
      const eventDate = new Date(reg.Events?.date);
      if (eventDate >= now) upcomingEventsCount++;
      else pastEventsCount++;

      if (reg.attended && reg.Events?.certificatesIssued) certificatesCount++;
    });

    let pendingPubs = 0;
    let approvedPubs = 0;
    let rejectedPubs = 0;

    (publicationsRes.data || []).forEach((pub: any) => {
      if (pub.status === 'PENDING') pendingPubs++;
      if (pub.status === 'APPROVED') approvedPubs++;
      if (pub.status === 'REJECTED') rejectedPubs++;
    });

    return NextResponse.json({
      user: {
        ...userRes.data,
        membershipStatus: membershipRes.data?.status || 'UNREGISTERED',
        phone: membershipRes.data?.phone || null
      },
      metrics: {
        events: { total: upcomingEventsCount + pastEventsCount, upcoming: upcomingEventsCount, past: pastEventsCount },
        certificates: { earned: certificatesCount },
        publications: { total: (publicationsRes.data || []).length, pending: pendingPubs, approved: approvedPubs, rejected: rejectedPubs }
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}