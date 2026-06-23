import { verifyAdmin } from '@/app/lib/utilities/auth';
import { supabase } from '@/app/lib/utilities/supabase';
import { NextResponse } from 'next/server'; 
import { uploadToS3CustomPath } from '@/app/lib/utilities/s3';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
    const { id } = await params;
    
    try {
      const formData = await request.formData();
      const coverImage = formData.get('coverImage') as File | null;
      const galleryFiles = formData.getAll('gallery') as File[];
  
      let coverUrl = null;
      const galleryUrls: string[] = [];
  
      if (coverImage) {
        coverUrl = await uploadToS3CustomPath(coverImage, `events/${id}/cover`);
      }
      console.log('Events : ',coverImage);
      
  
      for (const file of galleryFiles) {
        const sanitizedName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileUrl = await uploadToS3CustomPath(file, `events/${id}/gallery/${sanitizedName}`);
        galleryUrls.push(fileUrl);
      }
  
      const updateData: any = {};
      if (coverUrl) updateData.coverImage = coverUrl;
      
      if (galleryUrls.length > 0) {
        const { data: event } = await supabase.from('Events').select('gallery').eq('id', id).single();
        const existingGallery = event?.gallery || [];
        updateData.gallery = [...existingGallery, ...galleryUrls];
      }
  
      const { error } = await supabase.from('Events').update(updateData).eq('id', id);
      if (error) throw error;
  
      return NextResponse.json({ message: 'Photos uploaded successfully', coverUrl, galleryUrls }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }