import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // 1. Securely identify the logged-in user
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
    console.log( "DEBUGGING P-KEY From USER", p.key , "API : api/user/certificates/[id]/render ");

    // Generates the unique verification URL for the QR code
    if (p.type === 'qr' || p.key === '{{id}}' || p.key === '{{verify_url}}') {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        text = `${baseUrl}/verify/${id}/${userId}`;
    }
    
    return { ...p, text };
  });

  return NextResponse.json({ 
    backgroundUrl: secureBackgroundUrl, 
    renderData 
  }, { status: 200 });
}