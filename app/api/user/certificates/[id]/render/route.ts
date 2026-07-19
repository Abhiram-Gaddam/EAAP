import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // 1. Securely identify the logged-in user
  const DEFAULT_PHOTO_URL = 'https://ui-avatars.com/api/?name=Member&size=400&background=e2e8f0&color=64748b&bold=true';

  const sessionUser = await verifyUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const userId = sessionUser.userId;

  // 2. Fetch the Event and Template
  const { data: event, error: eventError } = await supabase
    .from('Events')
    .select('title, date, certificatesIssued, CertificateTemplates(*)')
    .eq('id', id)
    .single();

  // 3. Fetch the User's Registration
  const { data: userReg, error: userError } = await supabase
    .from('EventRegistrations')
    .select('attended, User(fullName)')
    .eq('eventId', id)
    .eq('userId', userId)
    .single();

    const { data: photoDoc } = await supabase
        .from('Documents')
        .select('fileUrl')
        .eq('userId', userId)
        .eq('documentType', 'PHOTO')   // must match the value you store when uploading profile photos
        .maybeSingle();        // maybeSingle so it doesn't throw if no row exists
    
      // If found, generate a short-lived presigned URL; otherwise use the default
      let resolvedPhotoUrl: string = DEFAULT_PHOTO_URL;
      if (photoDoc?.fileUrl) {
        try {
          resolvedPhotoUrl = (await getPresignedUrl(photoDoc.fileUrl)) ?? DEFAULT_PHOTO_URL;
        } catch {
          // Presign failed — degrade gracefully to default
          resolvedPhotoUrl = DEFAULT_PHOTO_URL;
        }
      }

  if (eventError || userError || !event?.CertificateTemplates) {
    return NextResponse.json({ error: 'Data not found' }, { status: 404 });
  }

  if (!event.certificatesIssued) {
    return NextResponse.json({ error: 'Certificates for this event have not been issued yet.' }, { status: 403 });
  }
  
  if (!userReg.attended) {
    return NextResponse.json({ error: 'You did not attend this event and cannot claim a certificate.' }, { status: 403 });
  }

  // 4. Process the Template
  const template = Array.isArray(event.CertificateTemplates) ? event.CertificateTemplates[0] : event.CertificateTemplates;
  const secureBackgroundUrl = await getPresignedUrl(template.backgroundUrl);
  const userFullName = Array.isArray(userReg.User) ? (userReg.User[0] as any).fullName : (userReg.User as any).fullName;

  // 5. Map the Placeholders
  const renderData = template.placeholders.map((p: any) => {
    let text = p.key;
    if (p.key === '{{name}}') text = userFullName;
    if (p.key === '{{date}}') text = new Date(event.date).toLocaleDateString();
    if (p.key === '{{event}}' || p.key === '{{eventName}}'||p.key === '{{eventTitle}}') text = event.title;
    
    // Generates the unique verification URL for the QR code
    if (p.type === 'qr' || p.key === '{{id}}' || p.key === '{{verify_url}}') {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.eaap.in/';
        text = `${baseUrl}/verify/${id}/${userId}`;
    }
    if (p.type === 'photo' || p.key === '{{photo}}') {
      text = resolvedPhotoUrl; // presigned S3 URL or DEFAULT_PHOTO_URL
    }
    
    return { ...p, text };
  });
console.log(renderData)
  return NextResponse.json({ 
    backgroundUrl: secureBackgroundUrl, 
    renderData 
  }, { status: 200 });
}