import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;

  const { data: application, error: appError } = await supabase
    .from('MembershipDetails')
    .select('*, User(id, fullName, email, role)')
    .eq('id', id)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const { data: documents, error: docError } = await supabase
    .from('Documents')
    .select('*')
    .eq('userId', application.userId);

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 });
  }

  return NextResponse.json({ application, documents }, { status: 200 });
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const timestamp = new Date().toISOString();

  const { data: application, error: fetchError } = await supabase
    .from('MembershipDetails')
    .select('userId')
    .eq('id', id)
    .single();

  if (fetchError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const userId = application.userId;

  const { error: appError } = await supabase
    .from('MembershipDetails')
    .update({ status: 'DELETED', deletedAt: timestamp })
    .eq('id', id);

  if (appError) {
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  const { error: userError } = await supabase
    .from('User')
    .update({ deletedAt: timestamp })
    .eq('id', userId);

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const { error: docError } = await supabase
    .from('Documents')
    .update({ deletedAt: timestamp })
    .eq('userId', userId);

  if (docError) {
    return NextResponse.json({ error: docError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Application, User, and Documents successfully soft deleted' }, { status: 200 });
}