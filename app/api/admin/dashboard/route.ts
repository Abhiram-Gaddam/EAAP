import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const now = new Date().toISOString();

    const [
      { count: activeMembers },
      { count: pendingPublications },
      { count: upcomingEventsCount },
      { data: revenueData },
      { data: recentAppsData },
      { data: eventsData }
    ] = await Promise.all([
      supabase
        .from('MembershipDetails')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'APPROVED'),
        
      supabase
        .from('Publications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING'),
        
      supabase
        .from('Events')
        .select('*', { count: 'exact', head: true })
        .gte('date', now),
        
      supabase
        .from('Transaction')
        .select('amount')
        .eq('status', 'SUCCESS'),

      supabase
        .from('MembershipDetails')
        .select('id, status, createdAt, highestQualification, User(fullName)')
        .in('status', ['PENDING_APPROVAL', 'APPROVED'])
        .order('createdAt', { ascending: false })
        .limit(4),

      supabase
        .from('Events')
        .select('id, title, date, type, EventRegistrations(id)')
        .gte('date', now)
        .order('date', { ascending: true })
        .limit(3)
    ]);

    const totalRevenue = revenueData?.reduce((sum, record) => sum + (Number(record.amount) || 0), 0) || 0;

    const recentApplications = recentAppsData?.map(app => ({
      id: app.id,
      name: Array.isArray(app.User) ? (app.User[0] as any)?.fullName : (app.User as any)?.fullName,
      qualification: app.highestQualification,
      date: app.createdAt,
      status: app.status 
    })) || [];

    const eventSchedule = eventsData?.map(evt => ({
      id: evt.id,
      title: evt.title,
      date: evt.date,
      type: evt.type,
      attendees: Array.isArray(evt.EventRegistrations) ? evt.EventRegistrations.length : 0
    })) || [];

    return NextResponse.json({
      kpis: {
        activeMembers: activeMembers || 0,
        pendingPublications: pendingPublications || 0,
        upcomingEvents: upcomingEventsCount || 0,
        totalRevenue
      },
      recentApplications,
      eventSchedule
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}