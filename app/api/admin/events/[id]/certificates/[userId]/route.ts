// import { verifyAdmin } from '@/app/lib/utilities/auth';
// import { getPresignedUrl } from '@/app/lib/utilities/s3';
// import { supabase } from '@/app/lib/utilities/supabase';
// import { NextResponse } from 'next/server'; 

// export async function GET(request: Request, { params }: { params: Promise<{ id: string, userId: string }> }) {
//   const admin = await verifyAdmin();
//   if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//   // A publicly accessible silhouette used when no photo is on file
// const DEFAULT_PHOTO_URL = 'https://ui-avatars.com/api/?name=Member&size=400&background=e2e8f0&color=64748b&bold=true';


//   // Note: Changed eventId to id to match your Next.js folder structure [id]
//   const { id, userId } = await params;

//   const { data: event, error: eventError } = await supabase
//     .from('Events')
//     .select('title, date, certificatesIssued,CertificateTemplates(*)')
//     .eq('id', id)
//     .single();

//   const { data: userReg, error: userError } = await supabase
//     .from('EventRegistrations')
//     .select('attended,User(fullName)')
//     .eq('eventId', id)
//     .eq('userId', userId)
//     .single();

//   if (eventError || userError || !event?.CertificateTemplates) {
//     return NextResponse.json({ error: 'Data not found' }, { status: 404 });
//   }
//   if (!event.certificatesIssued) {
//     return NextResponse.json({ 
//       error: 'Certificates for this event have not been issued yet.' 
//     }, { status: 403 });
//   }
  
//   if (!userReg.attended) {
//     return NextResponse.json({ 
//       error: 'User did not attend this event and cannot claim a certificate.' 
//     }, { status: 403 });
//   }
//   const template = Array.isArray(event.CertificateTemplates) ? event.CertificateTemplates[0] : event.CertificateTemplates;
//   const secureBackgroundUrl = await getPresignedUrl(template.backgroundUrl);
//   const userFullName = Array.isArray(userReg.User) ? (userReg.User[0] as any).fullName : (userReg.User as any).fullName;

//   const renderData = template.placeholders.map((p: any) => {
//     let text = p.key;
//     if (p.key === '{{name}}') text = userFullName;
//     if (p.key === '{{date}}') text = new Date(event.date).toLocaleDateString();
//     if (p.key === '{{event}}' || p.key === '{{eventName}}'||p.key === '{{eventTitle}}') text = event.title;
//     console.log( "DEBUGGING P-KEY", p.key , "Api : api/admin/events/[id]/certficates/[userid/");
//     // Generates the unique verification URL for this specific user and event
//     if (p.type === 'qr' || p.key === '{{id}}' || p.key === '{{verify_url}}') {
//         const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//         text = `${baseUrl}/verify/${id}/${userId}`;
//       }
    
//     return { ...p, text };
//   });

//   return NextResponse.json({ 
//     backgroundUrl: secureBackgroundUrl, 
//     renderData 
//   }, { status: 200 });
// }
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server';

// A publicly accessible silhouette used when no photo is on file
const DEFAULT_PHOTO_URL = 'https://ui-avatars.com/api/?name=Member&size=400&background=e2e8f0&color=64748b&bold=true';

export async function GET(request: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id, userId } = await params;

  // ── 1. Existing queries ────────────────────────────────────────────────────
  const { data: event, error: eventError } = await supabase
    .from('Events')
    .select('title, date, certificatesIssued, CertificateTemplates(*)')
    .eq('id', id)
    .single();

  const { data: userReg, error: userError } = await supabase
    .from('EventRegistrations')
    .select('attended, User(fullName)')
    .eq('eventId', id)
    .eq('userId', userId)
    .single();

  if (eventError || userError || !event?.CertificateTemplates) {
    return NextResponse.json({ error: 'Data not found' }, { status: 404 });
  }
  if (!event.certificatesIssued) {
    return NextResponse.json({ error: 'Certificates for this event have not been issued yet.' }, { status: 403 });
  }
  if (!userReg.attended) {
    return NextResponse.json({ error: 'User did not attend this event and cannot claim a certificate.' }, { status: 403 });
  }

  // ── 2. NEW: Fetch user photo from Documents table ──────────────────────────
  // Adjust table/column names to match your actual schema
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

  // ── 3. Build renderData ────────────────────────────────────────────────────
  const template = Array.isArray(event.CertificateTemplates)
    ? event.CertificateTemplates[0]
    : event.CertificateTemplates;

  const secureBackgroundUrl = await getPresignedUrl(template.backgroundUrl);

  const userFullName = Array.isArray(userReg.User)
    ? (userReg.User[0] as any).fullName
    : (userReg.User as any).fullName;

  const renderData = template.placeholders.map((p: any) => {
    let text = p.key; // fallback — always the raw key

    if (p.key === '{{name}}') text = userFullName;
    if (p.key === '{{date}}') text = new Date(event.date).toLocaleDateString();
    if (['{{event}}', '{{eventName}}', '{{eventTitle}}'].includes(p.key)) text = event.title;

    if (p.type === 'qr' || p.key === '{{id}}' || p.key === '{{verify_url}}') {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      text = `${baseUrl}/verify/${id}/${userId}`;
     }

    // ── NEW: photo placeholder ─────────────────────────────────────────────
    if (p.type === 'photo' || p.key === '{{photo}}') {
      text = resolvedPhotoUrl; // presigned S3 URL or DEFAULT_PHOTO_URL
    }

    return { ...p, text };
  });
   return NextResponse.json({ backgroundUrl: secureBackgroundUrl, renderData }, { status: 200 });
}