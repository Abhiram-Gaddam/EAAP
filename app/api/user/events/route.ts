import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

export async function GET() {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const now = new Date().toISOString();

    const { data: registrations, error: regError } = await supabase
      .from('EventRegistrations')
      .select(`
        id, 
        attended, 
        certificateUrl, 
        eventId,
        Events (id, title, date, location, type, coverImage, isPublished)
      `)
      .eq('userId', user.userId);

    if (regError) throw regError;

    const registeredUpcoming: any[] = [];
    const pastEvents: any[] = [];
    const registeredEventIds: string[] = [];

    (registrations || []).forEach((reg: any) => {
      if (!reg.Events) return;
      registeredEventIds.push(reg.eventId);

      if (new Date(reg.Events.date) >= new Date(now)) {
        registeredUpcoming.push(reg);
      } else {
        pastEvents.push(reg);
      }
    });

    let exploreQuery = supabase
      .from('Events')
      .select('id, title, date, location, type, coverImage')
      .eq('isPublished', true)
      .gte('date', now)
      .order('date', { ascending: true });

    if (registeredEventIds.length > 0) {
      exploreQuery = exploreQuery.not('id', 'in', `(${registeredEventIds.join(',')})`);
    }

    const { data: exploreEvents, error: exploreError } = await exploreQuery;
    if (exploreError) throw exploreError;

    // Sign all coverImages concurrently across all three lists
    const [signedUpcoming, signedPast, signedExplore] = await Promise.all([
      Promise.all(
        registeredUpcoming.map(async (reg) => ({
          ...reg,
          Events: {
            ...reg.Events,
            coverImage: await getPresignedUrl(reg.Events.coverImage),
          },
        }))
      ),
      Promise.all(
        pastEvents.map(async (reg) => ({
          ...reg,
          Events: {
            ...reg.Events,
            coverImage: await getPresignedUrl(reg.Events.coverImage),
          },
        }))
      ),
      Promise.all(
        (exploreEvents || []).map(async (evt) => ({
          ...evt,
          coverImage: await getPresignedUrl(evt.coverImage),
        }))
      ),
    ]);

    return NextResponse.json({
      registeredUpcoming: signedUpcoming,
      pastEvents: signedPast,
      exploreEvents: signedExplore,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}