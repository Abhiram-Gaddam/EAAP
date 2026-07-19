import { verifyAdmin } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 


export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { data, error } = await supabase
    .from('Events')
    .select(`*, EventRegistrations(id)`)
    .is('deletedAt', null)  
    .order('date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Use Promise.all to sign all image URLs concurrently
  const formattedData = await Promise.all(data.map(async (event: any) => ({
    ...event,
    coverImage: await getPresignedUrl(event.coverImage), // Sign the cover image
    registrationCount: event.EventRegistrations?.length || 0,
    EventRegistrations: undefined
  })));

  return NextResponse.json(formattedData, { status: 200 });
}

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    const { title, description, date, location, isPublished, type, coverImage, gallery,eventLink ,certificateTemplateId } = body;

    const { data, error } = await supabase
      .from('Events')
      .insert([{ title, description, date, location, isPublished, type, coverImage, gallery,eventLink,certificateTemplateId }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}