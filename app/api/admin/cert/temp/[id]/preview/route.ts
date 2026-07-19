import { verifyAdmin } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  const { data: template, error } = await supabase
    .from('CertificateTemplates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  const secureBackgroundUrl = await getPresignedUrl(template.backgroundUrl);

  const previewData = template.placeholders.map((p: any) => {
    let text = p.key;
    if (p.key === '{{name}}') text = 'Dr. John Doe (Preview)';
    if (p.key === '{{date}}') text = new Date().toLocaleDateString();
    if (p.key === '{{event}}') text = 'Sample Event Name';
    if (p.type === 'qr' || p.key === '{{id}}' || p.key === '{{verify_url}}') {
        const baseUrl = 'https://www.eaap.in/' ;
        text = `${baseUrl}/verify/sample-event-id/sample-user-id`;
      }
      if (p.type === 'photo' || p.key === '{{photo}}') {
        text = 'https://i.pravatar.cc/300'; // swap with your own CDN placeholder if preferred
      }
    return { ...p, text };
  });

  return NextResponse.json({ 
    backgroundUrl: secureBackgroundUrl, 
    renderData: previewData 
  }, { status: 200 });
}