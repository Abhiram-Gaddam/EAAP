import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { uploadToS3CustomPath, getPresignedUrl } from '@/app/lib/utilities/s3' ;

// CREATE A NEW TEMPLATE
export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const placeholdersStr = formData.get('placeholders') as string;
    const file = formData.get('background') as File;

    if (!file || !name || !placeholdersStr) {
        console.log(file ,'\n' ,name ,'\n', placeholdersStr);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const placeholders = JSON.parse(placeholdersStr);
    
    // Upload background to private S3 folder
    const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const backgroundUrl = await uploadToS3CustomPath(file, `certificates/templates/${sanitizedName}`);

    const { data, error } = await supabase
      .from('CertificateTemplates')
      .insert([{ name, backgroundUrl, placeholders }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Template created successfully', template: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET ALL TEMPLATES (For the listing page)
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { data, error } = await supabase
    .from('CertificateTemplates')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sign URLs so admin can preview them securely
  const formattedData = await Promise.all(data.map(async (template: any) => ({
    ...template,
    backgroundUrl: await getPresignedUrl(template.backgroundUrl)
  })));

  return NextResponse.json(formattedData, { status: 200 });
}