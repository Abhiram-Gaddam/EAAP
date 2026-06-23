import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

export async function GET() {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('Publications')
    .select('id, title, abstract, status, coverImage, publishedDate')
    .eq('submittedBy', user.userId)
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sign the cover image URLs so they render safely in the user's dashboard
  const formattedData = await Promise.all(data.map(async (pub: any) => ({
    ...pub,
    coverImage: pub.coverImage ? await getPresignedUrl(pub.coverImage) : null
  })));

  return NextResponse.json(formattedData, { status: 200 });
}
