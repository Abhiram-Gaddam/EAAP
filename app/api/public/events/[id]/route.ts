// src/app/api/public/events/[id]/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

/**
 * @API GET /api/public/events/[id]
 * @Description Fetches detailed information for a single published event by its ID.
 * Accessible to non-authenticated users. Resolves secure S3 URLs for all associated images.
 * * @Response 200 OK
 * {
 * "id": "uuid",
 * "title": "String",
 * "description": "String",
 * "date": "ISO-8601 Timestamp",
 * "location": "String",
 * "type": "String",
 * "eventLink": "String | null",
 * "isPublished": true,
 * "coverImage": "Presigned S3 URL String | null",
 * "gallery": ["Presigned S3 URL String"]
 * }
 * * @Response 404 Not Found
 * { "error": "Event not found or not published" }
 */
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the specific event, ensuring it is published to the public
    const { data: event, error: eventError } = await supabase
      .from('Events')
      .select('id, title, description, date, location, type, coverImage, gallery, eventLink, isPublished')
      .eq('id', id)
      .eq('isPublished', true)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found or not published' }, { status: 404 });
    }

    // Concurrently generate secure presigned URLs for the cover and all gallery images
    const [signedCover, signedGallery] = await Promise.all([
      event.coverImage ? getPresignedUrl(event.coverImage) : Promise.resolve(null),
      Promise.all((event.gallery || []).map((url: string) => getPresignedUrl(url))),
    ]);

    return NextResponse.json({
      ...event,
      coverImage: signedCover,
      gallery: signedGallery,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Public Event Details Fetch Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}