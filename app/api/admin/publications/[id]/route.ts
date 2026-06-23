import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { getPresignedUrl, deleteS3Object } from '@/app/lib/utilities/s3';

// 1. VIEW SINGLE PUBLICATION DETAILS
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('Publications')
      .select('*, User:submittedBy(fullName, email)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...data,
      pdfUrl: data.pdfUrl ? await getPresignedUrl(data.pdfUrl) : null,
      coverImage: data.coverImage ? await getPresignedUrl(data.coverImage) : null
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. EDIT PUBLICATION METADATA
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { title, problemStatement, abstract, authors, tags } = body;

    const { data, error } = await supabase
      .from('Publications')
      .update({ title, problemStatement, abstract, authors, tags })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Publication updated successfully', publication: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE PUBLICATION (AND S3 FILES)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const { data: pub, error: fetchError } = await supabase
      .from('Publications')
      .select('pdfUrl, coverImage')
      .eq('id', id)
      .single();

    if (fetchError || !pub) return NextResponse.json({ error: 'Publication not found' }, { status: 404 });

    if (pub.pdfUrl) await deleteS3Object(pub.pdfUrl);
    if (pub.coverImage) await deleteS3Object(pub.coverImage);

    const { error: deleteError } = await supabase
      .from('Publications')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Publication and associated files permanently deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}