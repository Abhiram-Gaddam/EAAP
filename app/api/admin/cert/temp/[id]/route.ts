import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { getPresignedUrl ,deleteS3Object } from '@/app/lib/utilities/s3' ;

// GET SINGLE TEMPLATE (For the editor screen)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  const { data, error } = await supabase
    .from('CertificateTemplates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  // Generate secure viewing link
  data.backgroundUrl = await getPresignedUrl(data.backgroundUrl);

  return NextResponse.json(data, { status: 200 });
}

// UPDATE TEMPLATE (Update the positions, colors, size, or name)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    const body = await request.json();
    // Expected body: { name: "Updated Name", placeholders: [...] }
    const { name, placeholders } = body;

    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (placeholders) updatePayload.placeholders = placeholders;
    const validTypes = ['text', 'qr', 'photo'];
    if (placeholders && !placeholders.every((p: any) => validTypes.includes(p.type))) {
      return NextResponse.json({ error: 'Invalid placeholder type' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('CertificateTemplates')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: 'Template updated successfully', template: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE TEMPLATE
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { id } = await params;

  try {
    // 1. Fetch template to get S3 URL
    const { data: template, error: fetchError } = await supabase
      .from('CertificateTemplates')
      .select('backgroundUrl')
      .eq('id', id)
      .single();

    if (fetchError || !template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    // 2. Delete the physical image from AWS S3
    await deleteS3Object(template.backgroundUrl);

    // 3. Delete the record from Supabase
    const { error: deleteError } = await supabase
      .from('CertificateTemplates')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Template permanently deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}