import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { uploadToS3CustomPath } from '@/app/lib/utilities/s3';
import { verifyUser } from '@/app/lib/utilities/auth'; 

export async function POST(request: Request) {
  try {
    const user = await verifyUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: No valid token found' }, { status: 401 });
    }

    // STRICT CHECK: Extract userId and force it to fail if it doesn't exist
    const userId = user.userId; 

    if (!userId) {
      // We send the 'user' object back in the error so you can see exactly what is inside it!
      return NextResponse.json({ 
        error: 'Token is valid, but userId is missing inside it', 
        tokenPayload: user 
      }, { status: 400 });
    }

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const problemStatement = formData.get('problemStatement') as string;
    const abstract = formData.get('abstract') as string;
    const authors = JSON.parse(formData.get('authors') as string || '[]'); 
    const tags = JSON.parse(formData.get('tags') as string || '[]'); 
    
    const pdfFile = formData.get('pdf') as File;
    const coverImageFile = formData.get('coverImage') as File | null;

    if (!title || !abstract || !pdfFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = Date.now();
    const pdfUrl = await uploadToS3CustomPath(pdfFile, `Publications/users/${userId}/doc_${timestamp}`);
    
    let coverImage = null;
    if (coverImageFile) {
      coverImage = await uploadToS3CustomPath(coverImageFile, `Publications/users/${userId}/cover_${timestamp}`);
    }

    const { data, error } = await supabase
      .from('Publications')
      .insert([{
        title,
        problemStatement,
        abstract,
        authors,
        tags,
        coverImage,
        pdfUrl,
        submittedBy: userId, 
        status: 'PENDING' 
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Publication submitted successfully', publication: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}