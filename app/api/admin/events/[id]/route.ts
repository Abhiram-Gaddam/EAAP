import { deleteS3Folder, getPresignedUrl  } from '@/app/lib/utilities/s3';
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 
 
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  const { data: event, error } = await supabase
    .from('Events')
    .select(`
      *,
      CertificateTemplates (*),
      EventRegistrations (
        id, attended, certificateUrl, createdAt,
        User ( id, fullName, email )
      )
    `)
    .is('deletedAt', null) 
    .eq('id', id)
    .single();

  if (error || !event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  // Sign all URLs before returning
  const eventWithSignedUrls = {
    ...event,
    coverImage: await getPresignedUrl(event.coverImage),
    gallery: event.gallery && event.gallery.length > 0 
      ? await Promise.all(event.gallery.map((url: string) => getPresignedUrl(url)))
      : [],
      CertificateTemplates: event.CertificateTemplates ? {
        ...event.CertificateTemplates,
        backgroundUrl: await getPresignedUrl(event.CertificateTemplates.backgroundUrl)
      } : null,
    registrationCount: event.EventRegistrations?.length || 0
  };

  return NextResponse.json(eventWithSignedUrls, { status: 200 });
}
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { error } = await supabase
      .from('Events')
      .update(body)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Event updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
    const { id } = await params;
    const timestamp = new Date().toISOString();
  
    // 1. Hard delete all S3 objects for this event
    try {
      await deleteS3Folder(`events/${id}/`);
    } catch (s3Error: any) {
      console.error("Failed to delete S3 objects:", s3Error);
      // Continuing with DB soft-delete even if S3 fails, or you can choose to return 500 here
    }
  
    // 2. Soft delete the database record and clear image URLs
    const { error } = await supabase
      .from('Events')
      .update({ 
        deletedAt: timestamp,
        coverImage: null, 
        gallery: [] 
      })
      .eq('id', id);
  
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ message: 'Event soft-deleted and assets permanently removed' }, { status: 200 });
  }