import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { getPresignedUrl } from '@/app/lib/utilities/s3';

/**
 * @API GET /api/public/publications
 * @Description Fetches a list of all publicly approved publications. 
 * Intended for the main publications exploration page where users do not need to be logged in.
 * Returns core details needed for card components (title, abstract, authors, coverImage)
 * AND dynamically extracts a unique list of all associated tags to enable frontend filtering.
 * * @Response 200 OK
 * {
 * "tags": ["String"], // Unique list of all tags used across approved publications
 * "publications": [
 * {
 * "id": "uuid",
 * "title": "String",
 * "abstract": "String",
 * "authors": ["String"],
 * "tags": ["String"],
 * "publishedDate": "ISO-8601 Timestamp",
 * "coverImage": "Presigned S3 URL String | null"
 * }
 * ]
 * }
 * * @Response 500 Internal Server Error
 * { "error": "String" }
 */
export async function GET() {
  try {
    const { data: publications, error } = await supabase
      .from('Publications')
      .select('id, title, abstract, authors, tags, publishedDate, coverImage')
      .eq('status', 'APPROVED') 
      .order('publishedDate', { ascending: false }); 

    if (error) throw error;

    const uniqueTagsSet = new Set<string>();

    const signedPublications = await Promise.all((publications || []).map(async (pub) => {
      if (pub.tags && Array.isArray(pub.tags)) {
        pub.tags.forEach((tag: string) => uniqueTagsSet.add(tag));
      }

      return {
        ...pub,
        coverImage: pub.coverImage ? await getPresignedUrl(pub.coverImage) : null,
      };
    }));
     return NextResponse.json({
      tags: Array.from(uniqueTagsSet),
      publications: signedPublications
    }, { status: 200 });

  } catch (error: any) {
    console.error("Public Publications Fetch Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}