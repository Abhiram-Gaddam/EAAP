import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { uploadToS3CustomPath, getPresignedUrl } from '@/app/lib/utilities/s3';

// View All User Publications
export async function GET() {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data: publications, error } = await supabase
      .from('Publications')
      .select('id, title, status, createdAt, coverImage')
      .eq('submittedBy', user.userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    // Securely sign the cover images for the dashboard list
    const signedPublications = await Promise.all((publications || []).map(async (pub) => ({
      ...pub,
      coverImage: pub.coverImage ? await getPresignedUrl(pub.coverImage) : null,
    })));

    return NextResponse.json(signedPublications, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a New Publication (Saved as DRAFT initially)
export async function POST(request: Request) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const problemStatement = formData.get('problemStatement') as string;
    const authors = JSON.parse((formData.get('authors') as string) || '[]');
    const tags = JSON.parse((formData.get('tags') as string) || '[]');

    const pdfFile = formData.get('pdf') as File | null;
    const coverImageFile = formData.get('coverImage') as File | null;

    if (!title || !abstract || !pdfFile) {
      return NextResponse.json({ error: 'Title, abstract, and PDF are required' }, { status: 400 });
    }

    // 1. Upload files using your custom S3 utility
    const pdfUrl = await uploadToS3CustomPath(pdfFile, `Publications/${user.userId}/pdf`);
    let coverImageUrl = null;
    
    if (coverImageFile) {
      coverImageUrl = await uploadToS3CustomPath(coverImageFile, `Publications/${user.userId}/cover`);
    }

    // 2. Save as DRAFT in Supabase
    const { data, error } = await supabase
      .from('Publications')
      .insert([{
        title, abstract, problemStatement, authors, tags,
        pdfUrl, coverImage: coverImageUrl,
        submittedBy: user.userId,
        status: 'DRAFT' // Initially saved as draft
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Draft saved successfully', publication: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}