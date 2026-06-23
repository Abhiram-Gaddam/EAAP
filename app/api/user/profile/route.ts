// src/app/api/user/profile/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';
import { getPresignedUrl, uploadToS3CustomPath, deleteS3Object } from '@/app/lib/utilities/s3';

export async function GET() {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id, fullName, email, createdAt')
      .eq('id', user.userId)
      .single();

    if (userError) throw userError;

    const { data: docData } = await supabase
      .from('Documents')
      .select('fileUrl')
      .eq('userId', user.userId)
      .eq('documentType', 'PHOTO')
      .order('uploadedAt', { ascending: false })
      .limit(1)
      .single();

    let signedProfilePicture = null;
    if (docData?.fileUrl) {
      signedProfilePicture = await getPresignedUrl(docData.fileUrl);
    }

    const initials = userData.fullName 
      ? userData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) 
      : 'U';

    return NextResponse.json({
      ...userData,
      profilePicture: signedProfilePicture,
      initials: initials
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const profilePicFile = formData.get('profilePicture') as File | null;

    if (fullName) {
      const { error: updateError } = await supabase
        .from('User')
        .update({ fullName, updatedAt: new Date().toISOString() })
        .eq('id', user.userId);

      if (updateError) throw updateError;
    }

    if (profilePicFile && profilePicFile.size > 0) {
      const { data: oldDoc } = await supabase
        .from('Documents')
        .select('id, fileUrl')
        .eq('userId', user.userId)
        .eq('documentType', 'PHOTO')
        .order('uploadedAt', { ascending: false })
        .limit(1)
        .single();

      if (oldDoc?.fileUrl) {
        await deleteS3Object(oldDoc.fileUrl);
        await supabase.from('Documents').delete().eq('id', oldDoc.id);
      }

      const timestamp = Date.now();
      const newFileUrl = await uploadToS3CustomPath(
        profilePicFile, 
        `profiles/${user.userId}/pic_${timestamp}`
      );

      const { error: docError } = await supabase
        .from('Documents')
        .insert([{
          userId: user.userId,
          documentType: 'PHOTO',
          fileUrl: newFileUrl,
          uploadedAt: new Date().toISOString()
        }]);

      if (docError) throw docError;
    }

    const { data: updatedUser, error: fetchError } = await supabase
      .from('User')
      .select('id, fullName, email')
      .eq('id', user.userId)
      .single();
      
    if (fetchError) throw fetchError;

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}