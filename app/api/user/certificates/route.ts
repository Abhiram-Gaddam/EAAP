import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

export async function GET() {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // 1. Fetch User Data & Membership Details
    const [userRes, membershipRes] = await Promise.all([
      supabase.from('User').select('fullName').eq('id', user.userId).single(),
      supabase.from('MembershipDetails').select('id, status, createdAt').eq('userId', user.userId).maybeSingle()
    ]);

    if (userRes.error) throw userRes.error;
    const userName = userRes.data.fullName;

    // 2. Fetch Event Registrations with Template Data
    const { data: registrations, error: regError } = await supabase
      .from('EventRegistrations')
      .select(`
        eventId,
        attended,
        certificateUrl,
        Events!inner (
          title,
          date,
          certificatesIssued,
          CertificateTemplates (
            backgroundUrl,
            placeholders
          )
        )
      `)
      .eq('userId', user.userId)
      .eq('attended', true)
      // Only fetch if the admin has explicitly clicked "Issue Certificates"
      .eq('Events.certificatesIssued', true); 

    if (regError) throw regError;

    // 3. Process and format the Event Certificates
    const eventCertificates = await Promise.all((registrations || []).map(async (reg: any) => {
      const template = reg.Events?.CertificateTemplates;
      
      // Securely sign the template background so the frontend can draw on it
      const signedBackground = template?.backgroundUrl 
        ? await getPresignedUrl(template.backgroundUrl) 
        : null;

      return {
        eventId: reg.eventId,
        eventTitle: reg.Events.title,
        eventDate: reg.Events.date,
        // Pre-generated static PDF (if you choose to upload them manually)
        staticUrl: reg.certificateUrl ? await getPresignedUrl(reg.certificateUrl) : null,
        // Dynamic Template Data (for frontend canvas rendering)
        dynamicData: template ? {
          backgroundUrl: signedBackground,
          placeholders: template.placeholders, // e.g., { name: { x: 100, y: 200 } }
          fillData: {
            name: userName,
            event: reg.Events.title,
            date: reg.Events.date
          }
        } : null,
        verificationUrl: `/verify/${reg.eventId}/${user.userId}`
      };
    }));

    // 4. Determine Membership Certificate Status
    let membershipCertificate = null;
    // Assuming 'APPROVED' or 'ACTIVE' is your valid membership status
    if (membershipRes.data && ['APPROVED', 'ACTIVE'].includes(membershipRes.data.status)) {
      membershipCertificate = {
        memberId: membershipRes.data.id,
        memberName: userName,
        issueDate: membershipRes.data.createdAt,
        status: membershipRes.data.status
        // Note: You can add a hardcoded template background here for memberships if needed
      };
    }

    return NextResponse.json({
      membership: membershipCertificate,
      events: eventCertificates
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}