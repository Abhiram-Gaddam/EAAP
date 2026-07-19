// src/app/api/admin/financials/[id]/issue-certificate/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
// import { generateAndUploadCertificate } from '@/app/lib/utilities/certificateGenerator';

export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyUser();
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id: transactionId } = await params;

    const { data: transaction, error: txError } = await supabase
      .from('Transaction')
      .select('id, userId, status, transactionType, User(fullName)')
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    if (transaction.status !== 'SUCCESS') return NextResponse.json({ error: 'Cannot issue certificate for incomplete payment' }, { status: 400 });

    const { data: template, error: templateError } = await supabase
      .from('CertificateTemplates')
      .select('id, backgroundUrl, placeholders')
      .ilike('name', 'Membership Certificate')
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: 'Membership Certificate template not found in database' }, { status: 404 });
    }

    // const newCertificateUrl = await generateAndUploadCertificate(transaction.User.fullName, transaction.userId, template);
    const mockGeneratedCertificateUrl = `
https://eaap-objects.s3.eu-north-1.amazonaws.com/certificates/membership_${transaction.userId}_${Date.now()}.pdf`;

    const { data: updatedMembership, error: updateError } = await supabase
      .from('MembershipDetails')
      .update({ 
        status: 'ACTIVE', 
        certificateUrl: mockGeneratedCertificateUrl,
        updatedAt: new Date().toISOString()
      })
      .eq('userId', transaction.userId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ 
      message: 'Certificate issued successfully', 
      certificateUrl: updatedMembership.certificateUrl 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}