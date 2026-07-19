import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

/**
 * @API GET /api/public/events
 * @Description Fetches public event data for non-authenticated pages. 
 * Returns categorized events (upcoming vs past) along with a unique list of event types for frontend filtering.
 * * @Response 200 OK
 * {
 * types: string[], // Unique event types available in the DB (e.g., ['WORKSHOP', 'CONFERENCE'])
 * upcomingEvents: Array<{ id, title, date, location, type, coverImage }>,
 * pastEvents: Array<{ id, title, date, location, type, coverImage }>
 * }
 * * @Response 500 Internal Server Error
 * { error: string }
 */
export async function GET() {
  try {
    const now = new Date().toISOString();

    // 1. Fetch all published events from the database ordered by date
    const { data: events, error: eventsError } = await supabase
      .from('Events')
      .select('id, title, date, location, type, coverImage')
      .eq('isPublished', true)
      .order('date', { ascending: true });

    if (eventsError) throw eventsError;

    const upcomingEventsRaw: any[] = [];
    const pastEventsRaw: any[] = [];
    const uniqueTypesSet = new Set<string>();

    // 2. Single pass iteration to categorize events and gather unique filter types
    (events || []).forEach((evt: any) => {
      // Collect event types for structural frontend drop-downs/filters
      if (evt.type) {
        uniqueTypesSet.add(evt.type);
      }

      // Sort chronological placement relative to the current timestamp
      if (new Date(evt.date) >= new Date(now)) {
        upcomingEventsRaw.push(evt);
      } else {
        pastEventsRaw.push(evt);
      }
    });

    // 3. Resolve S3 presigned URLs concurrently to keep response delivery fast
    const [signedUpcoming, signedPast] = await Promise.all([
      Promise.all(
        upcomingEventsRaw.map(async (evt) => ({
          ...evt,
          coverImage: await getPresignedUrl(evt.coverImage),
        }))
      ),
      Promise.all(
        pastEventsRaw.map(async (evt) => ({
          ...evt,
          coverImage: await getPresignedUrl(evt.coverImage),
        }))
      ),
    ]);

    // 4. Structural Payload Delivery
    return NextResponse.json({
      types: Array.from(uniqueTypesSet),
      upcomingEvents: signedUpcoming,
      pastEvents: signedPast,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Public Events Fetch Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}