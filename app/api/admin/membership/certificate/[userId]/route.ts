// Changed the File Naming Convention 
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin} from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

const DEFAULT_PHOTO_URL = 'https://ui-avatars.com/api/?name=Member&size=400&background=e2e8f0&color=64748b&bold=true';

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  // 1. Authenticate and Authorize
  const currentUser = await verifyAdmin();
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = await params;

  // Allow admins to view anyone's certificate, but restrict regular users to only their own
  if (currentUser.role !== 'ADMIN' && currentUser.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // 2. Fetch Membership details and User's full name
    const { data: membership, error: membershipError } = await supabase
      .from('MembershipDetails')
      .select('id, status, createdAt, User(fullName),registrationNum')
      .eq('userId', userId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Membership record not found' }, { status: 404 });
    }

    // Ensure the membership is completely approved/active
    if (membership.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Membership is not active. Certificate unavailable.' }, { status: 403 });
    }


    // 3. Fetch the specific "Membership Certificate" Template
    const { data: template, error: templateError } = await supabase
      .from('CertificateTemplates')
      .select('backgroundUrl, placeholders')
      .ilike('name', 'Membership Certificate')
       .single();

    if (templateError || !template) {
      return NextResponse.json({ error: 'Membership Certificate template not found in database' }, { status: 404 });
    }

    // 4. Fetch user photo from Documents table
    const { data: photoDoc } = await supabase
      .from('Documents')
      .select('fileUrl')
      .eq('userId', userId)
      .eq('documentType', 'PHOTO')
      .maybeSingle();

    let resolvedPhotoUrl: string = DEFAULT_PHOTO_URL;
    if (photoDoc?.fileUrl) {
      try {
        resolvedPhotoUrl = (await getPresignedUrl(photoDoc.fileUrl)) ?? DEFAULT_PHOTO_URL;
      } catch {
        resolvedPhotoUrl = DEFAULT_PHOTO_URL;
      }
    }

    // 5. Build renderData
    const secureBackgroundUrl = await getPresignedUrl(template.backgroundUrl);
    
    const userFullName = Array.isArray(membership.User)
      ? (membership.User[0] as any).fullName
      : (membership.User as any).fullName;
    
    const renderData = template.placeholders.map((p: any) => {
      let text = p.key;

      if (p.key === '{{name}}') text = userFullName;
      if (p.key === '{{date}}') text = new Date(membership.createdAt).toLocaleDateString();
      if (['{{event}}', '{{eventName}}', '{{type}}'].includes(p.key)) text = 'Lifetime Membership';
      if (p.key === '{{membershipId}}') text = `MEM-${membership.id.split('-')[0].toUpperCase()}`; 
      if (p.key === '{{registrationNum}}') text = `${membership.registrationNum}`; 

      // QR Code for verifying the specific membership
      if (p.type === 'qr' || p.key === '{{id}}' || p.key === '{{verify_url}}') {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.eaap.in' ;
        text = `${baseUrl}/verify/membership/${userId}`;
 
      }

      if (p.type === 'photo' || p.key === '{{photo}}') {
        text = resolvedPhotoUrl;
      }

      return { ...p, text };
    });

    return NextResponse.json({ backgroundUrl: secureBackgroundUrl, renderData }, { status: 200 });

  } catch (error: any) {
    console.error('Membership Certificate Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}