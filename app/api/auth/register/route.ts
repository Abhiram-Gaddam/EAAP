import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/utilities/supabase';


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY !,
  },
});

async function uploadToS3(file: File, userId: string, docType: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `users/${userId}/${docType}_${Date.now()}.${fileExtension}`;
  
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME !,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );
  
    return fileName;
  }

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // ... (Keep all your existing form data extractions exactly as they are) ...
    const fullName = formData.get('fullName') as string; 
    const phone = formData.get('phone') as string; 
    const cityDistrict = formData.get('cityDistrict') as string; 
    const email = formData.get('email') as string; 
    const password = formData.get('password') as string; 

    const highestQualification = formData.get('highestQualification') as string; 
    const currentDesignation = formData.get('currentDesignation') as string; 
    const currentHospital = formData.get('currentHospital') as string; 
    const clinicalEmbryologyExpYrs = parseInt(formData.get('clinicalEmbryologyExpYrs') as string) || 0; 

    const eduCertificate = formData.get('eduCertificate') as File | null;
    const expCertificate = formData.get('expCertificate') as File | null;
    const photo = formData.get('photo') as File | null;
    const govId = formData.get('govId') as File | null;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required credentials' }, { status: 400 });
    }

    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .is('deletedAt', null)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // 1. Create the User
    const { data: user, error: userError } = await supabase
      .from('User')
      .insert([{ email, passwordHash, fullName, role: 'APPLICANT' }])
      .select()
      .single();

    if (userError) return NextResponse.json({ error: userError.message }, { status: 400 });

    const userId = user.id;

    // --- TRANSACTION BLOCK START ---
    // If anything fails in here, we delete the user we just created.
    try {
      const documentUploads = [
        { file: eduCertificate, type: 'HIGHEST_EDU_CERTIFICATE' },
        { file: expCertificate, type: 'EXPERIENCE_CERTIFICATE' },
        { file: photo, type: 'PHOTO' },
        { file: govId, type: 'GOV_ID' },
      ];

      const documentsToInsert = [];

      for (const doc of documentUploads) {
        // Ensure it's actually a File object and not just a string
        if (doc.file && typeof doc.file === 'object' && doc.file.size > 0) {
          const fileUrl = await uploadToS3(doc.file, userId, doc.type);
          documentsToInsert.push({ userId, documentType: doc.type, fileUrl });
        }
      }

      if (documentsToInsert.length > 0) {
        const { error: docError } = await supabase.from('Documents').insert(documentsToInsert);
        if (docError) throw new Error(`Document DB Insert Failed: ${docError.message}`);
      }

      const { error: profileError } = await supabase
        .from('MembershipDetails')
        .insert([{ 
          userId, 
          phone, 
          cityDistrict, 
          highestQualification, 
          currentDesignation, 
          currentHospital, 
          clinicalEmbryologyExpYrs, 
          status: 'PENDING' 
        }]);

      if (profileError) throw new Error(`Membership DB Insert Failed: ${profileError.message}`);

      return NextResponse.json({ message: 'Registration successful', userId }, { status: 201 });

    } catch (innerError: any) {
      // ROLLBACK: Delete the user because something else failed
      console.error("TRANSACTION FAILED, ROLLING BACK USER:", innerError);
      await supabase.from('User').delete().eq('id', userId);
      
      return NextResponse.json({ error: innerError.message || 'Registration transaction failed' }, { status: 500 });
    }
    // --- TRANSACTION BLOCK END ---

  } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
  }
}