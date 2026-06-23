import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { uploadToS3CustomPath, getPresignedUrl } from '@/app/lib/utilities/s3';

// View a Single Publication
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('Publications')
      .select('*')
      .eq('id', id)
      .eq('submittedBy', user.userId)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      ...data,
      coverImage: data.coverImage ? await getPresignedUrl(data.coverImage) : null,
      pdfUrl: data.pdfUrl ? await getPresignedUrl(data.pdfUrl) : null
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Edit a Publication
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    // Prevent editing if it's already approved
    const { data: existingPub } = await supabase.from('Publications').select('status').eq('id', id).single();
    if (existingPub?.status === 'APPROVED') {
      return NextResponse.json({ error: 'Cannot edit an approved publication' }, { status: 403 });
    }

    const formData = await request.formData();
    
    // Build update payload
    const updateData: any = {
      title: formData.get('title') as string,
      abstract: formData.get('abstract') as string,
      problemStatement: formData.get('problemStatement') as string,
      authors: JSON.parse((formData.get('authors') as string) || '[]'),
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      updatedAt: new Date().toISOString()
    };

    // Handle optional file replacements
    const pdfFile = formData.get('pdf') as File | null;
    const coverImageFile = formData.get('coverImage') as File | null;

    if (pdfFile && pdfFile.size > 0) {
      updateData.pdfUrl = await uploadToS3CustomPath(pdfFile, `publications/${user.userId}/pdf`);
    }
    if (coverImageFile && coverImageFile.size > 0) {
      updateData.coverImage = await uploadToS3CustomPath(coverImageFile, `publications/${user.userId}/cover`);
    }

    const { error } = await supabase
      .from('Publications')
      .update(updateData)
      .eq('id', id)
      .eq('submittedBy', user.userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Publication updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a Publication
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const { error } = await supabase
      .from('Publications')
      .delete()
      .eq('id', id)
      .eq('submittedBy', user.userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Publication deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}