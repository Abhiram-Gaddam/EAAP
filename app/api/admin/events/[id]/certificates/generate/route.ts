import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 
import { uploadToS3 } from '@/app/lib/utilities/s3';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const { data: event, error: eventError } = await supabase
      .from('Events')
      .select('*, CertificateTemplates(*)')
      .eq('id', id)
      .single();

    if (eventError || !event || !event.certificateTemplateId) {
      return NextResponse.json({ error: 'Event or template not found' }, { status: 404 });
    }

    const { data: attendees, error: attendeesError } = await supabase
      .from('EventRegistrations')
      .select('id, userId, User(fullName)')
      .eq('eventId', id)
      .eq('attended', true)
      .is('certificateUrl', null);

    if (attendeesError) throw attendeesError;

    const generatedCertificates = [];

    const template = Array.isArray(event.CertificateTemplates) 
      ? event.CertificateTemplates[0] 
      : event.CertificateTemplates;

    for (const attendee of attendees) {
      const userFullName = Array.isArray(attendee.User) 
        ? (attendee.User[0] as any)?.fullName 
        : (attendee.User as any)?.fullName;

      const certificateData = {
        templateUrl: (template as any)?.backgroundUrl,
        placeholders: (template as any)?.placeholders,
        userData: {
          name: userFullName,
          eventName: event.title,
          date: event.date
        }
      };

      const pdfGenerationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/internal/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData)
      });

      if (pdfGenerationResponse.ok) {
        const { fileUrl } = await pdfGenerationResponse.json();
        
        await supabase
          .from('EventRegistrations')
          .update({ certificateUrl: fileUrl })
          .eq('id', attendee.id);

        generatedCertificates.push({ userId: attendee.userId, fileUrl });
      }
    }

    return NextResponse.json({ 
      message: `Generated ${generatedCertificates.length} certificates`,
      certificates: generatedCertificates
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}