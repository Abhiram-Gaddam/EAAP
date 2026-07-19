// src/app/api/public/publications/[id]/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

/**
 * @API GET /api/public/publications/[id]
 * @Description Fetches full details for a specific approved publication by its ID.
 * Generates secure, temporary URLs for both the cover image and the actual PDF document 
 * so public users can read or download the research.
 * * @Response 200 OK
 * {
 * "id": "uuid",
 * "title": "String",
 * "abstract": "String",
 * "problemStatement": "String",
 * "authors": ["String"],
 * "tags": ["String"],
 * "publishedDate": "ISO-8601 Timestamp",
 * "coverImage": "Presigned S3 URL String | null",
 * "pdfUrl": "Presigned S3 URL String | null"
 * }
 * * @Response 404 Not Found
 * { "error": "Publication not found or not approved" }
 */
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: publication, error } = await supabase
      .from('Publications')
      .select('id, title, abstract, problemStatement, authors, tags, publishedDate, coverImage, pdfUrl')
      .eq('id', id)
      .eq('status', 'APPROVED')  
      .single();

    if (error || !publication) {
      return NextResponse.json({ error: 'Publication not found or not approved' }, { status: 404 });
    }

    // Sign both the cover image and the PDF concurrently
    const [signedCover, signedPdf] = await Promise.all([
      publication.coverImage ? getPresignedUrl(publication.coverImage) : Promise.resolve(null),
      publication.pdfUrl ? getPresignedUrl(publication.pdfUrl) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      ...publication,
      coverImage: signedCover,
      pdfUrl: signedPdf,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Public Publication Details Fetch Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}