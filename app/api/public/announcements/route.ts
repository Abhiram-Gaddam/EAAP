 
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
// Adjust the import path below to where your getPresignedUrl function is located
import { getPresignedUrl } from '@/app/lib/utilities/s3'; 

export async function GET() {
  try {
    const [ { data: events }, { data: publications } ] = await Promise.all([
      supabase
        .from('Events')
        .select('id, title, description, date, type, coverImage')
        .eq('isPublished', true)
        .order('date', { ascending: false })
        .limit(8),
        
      supabase
        .from('Publications')
        .select('id, title, abstract, publishedDate, createdAt, coverImage')
        .eq('status', 'APPROVED')
        .order('createdAt', { ascending: false })
        .limit(8)
    ]);

    const formattedEvents = await Promise.all((events || []).map(async evt => {
      const presignedSrc = await getPresignedUrl(evt.coverImage);
      return {
        id: evt.id,
        date: new Date(evt.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
        category: evt.type || 'Event',
        title: evt.title,
        excerpt: evt.description ? (evt.description.substring(0, 100) + '...') : '',
        src: presignedSrc || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
        sortDate: new Date(evt.date).getTime()
      };
    }));

    const formattedPublications = await Promise.all((publications || []).map(async pub => {
      const presignedSrc = await getPresignedUrl(pub.coverImage);
      return {
        id: pub.id,
        date: new Date(pub.publishedDate || pub.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
        category: 'Research',
        title: pub.title,
        excerpt: pub.abstract ? (pub.abstract.substring(0, 100) + '...') : '',
        src: presignedSrc || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
        sortDate: new Date(pub.publishedDate || pub.createdAt).getTime()
      };
    }));

    const latestAnnouncements = [...formattedEvents, ...formattedPublications]
      .sort((a, b) => b.sortDate - a.sortDate)
      .slice(0, 8)
      .map(({ sortDate, ...rest }) => rest);

    return NextResponse.json(latestAnnouncements, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}