// app/api/verify/[eventId]/[userId]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ eventId: string, userId: string }> }) {
  try {
    const { eventId, userId } = await params;

    const { data: registration, error } = await supabase
      .from('EventRegistrations')
      .select('id, attended, User(fullName), Events(title, date, certificatesIssued)')
      .eq('eventId', eventId)
      .eq('userId', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
    }

    if (!registration) {
      return NextResponse.json({ valid: false, error: 'Registration not found' }, { status: 404 });
    }

    const event = Array.isArray(registration.Events) ? registration.Events[0] : registration.Events;
    const user = Array.isArray(registration.User) ? registration.User[0] : registration.User;

    if (!(event as any)?.certificatesIssued) {
      return NextResponse.json({ valid: false, error: 'Certificates not issued for this event' }, { status: 400 });
    }

    if (!registration.attended) {
      return NextResponse.json({ valid: false, error: 'User did not attend the event' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      data: {
        name: (user as any)?.fullName,
        eventTitle: (event as any)?.title,
        eventDate: (event as any)?.date,
        certificateId: registration.id
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}