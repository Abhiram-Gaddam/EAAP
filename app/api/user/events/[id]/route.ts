import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data: event, error: eventError } = await supabase
      .from('Events')
      .select('id, title, description, date, location, type, coverImage, gallery, eventLink, isPublished')
      .eq('id', id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Sign coverImage and all gallery images concurrently
    const [signedCover, signedGallery] = await Promise.all([
      getPresignedUrl(event.coverImage),
      Promise.all((event.gallery || []).map((url: string) => getPresignedUrl(url))),
    ]);

    let isRegistered = false;
    let attended = false;

    const user = await verifyUser();

    if (user) {
      const { data: registration } = await supabase
        .from('EventRegistrations')
        .select('id, attended')
        .eq('eventId', id)
        .eq('userId', user.userId)
        .maybeSingle();

      if (registration) {
        isRegistered = true;
        attended = registration.attended;
      }
    }

    return NextResponse.json({
      ...event,
      coverImage: signedCover,
      gallery: signedGallery,
      isRegistered,
      attended,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const { error } = await supabase
      .from('EventRegistrations')
      .delete()
      .eq('eventId', id)
      .eq('userId', user.userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Successfully canceled event registration' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}