// src/app/api/admin/publications/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { uploadToS3CustomPath, getPresignedUrl } from '@/app/lib/utilities/s3';

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');

  let query = supabase
    .from('Publications')
    .select('id, title, abstract, authors, status, submittedBy, createdAt, coverImage')
    .neq('status', 'DRAFT')
    .order('status', { ascending: false })
    .order('createdAt', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter.toUpperCase());
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const signedData = await Promise.all((data || []).map(async (pub: any) => ({
    ...pub,
    coverImage: pub.coverImage ? await getPresignedUrl(pub.coverImage) : null
  })));

  return NextResponse.json(signedData, { status: 200 });
}

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  const adminId = admin.userId; 
  if (!adminId) {
    return NextResponse.json({ error: 'Admin token missing userId' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const problemStatement = formData.get('problemStatement') as string;
    const abstract = formData.get('abstract') as string;
    const authors = JSON.parse(formData.get('authors') as string); 
    const tags = JSON.parse((formData.get('tags') as string) || '[]'); 
    
    const pdfFile = formData.get('pdf') as File;
    const coverImageFile = formData.get('coverImage') as File | null;

    if (!title || !abstract || !pdfFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = Date.now();
    const pdfUrl = await uploadToS3CustomPath(pdfFile, `Publications/admin/doc_${timestamp}`);
    
    let coverImage = null;
    if (coverImageFile) {
      coverImage = await uploadToS3CustomPath(coverImageFile, `Publications/admin/cover_${timestamp}`);
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
        submittedBy: adminId,  
        status: 'APPROVED',
        publishedDate: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Publication published successfully', publication: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}