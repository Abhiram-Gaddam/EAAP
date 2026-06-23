import { getPresignedUrl } from '@/app/lib/utilities/s3';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch the exact S3 URL from the database
  const { data, error } = await supabase
    .from('Publications')
    .select('pdfUrl, status')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Publication not found' }, { status: 404 });

  // Optional: Prevent downloading if it's still pending (unless you are admin)
  if (data.status !== 'APPROVED') {
    return NextResponse.json({ error: 'This publication is not approved for public viewing yet' }, { status: 403 });
  }

  // 2. Generate a secure link that expires in 60 seconds
  const secureDownloadUrl = await getPresignedUrl(data.pdfUrl);

  return NextResponse.json({ downloadUrl: secureDownloadUrl }, { status: 200 });
}