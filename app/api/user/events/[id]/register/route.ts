import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try{
    const { data: EVENTDET } = await supabase
  .from('Events')
  .select('title, date')
  .eq('id', id)
  .single();

if (EVENTDET?.date) {
  const eventDate = new Date(EVENTDET.date);

  if (eventDate <= new Date()) {
    return NextResponse.json(
      { error: 'Registrations Closed' },
      { status: 400 }
    );
  }
}


  }catch(error :any){
    return NextResponse.json({error  })
  }

  try {
    const { data: existingReg } = await supabase
      .from('EventRegistrations')
      .select('id')
      .eq('eventId', id)
      .eq('userId', user.userId)
      .single();
    
    if (existingReg) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('EventRegistrations')
      .insert([{
        eventId: id,
        userId: user.userId,
        attended: false
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Successfully registered for event', registration: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Add this below your existing POST function in the same file
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    // Attempt to delete the matching registration record
    const { error } = await supabase
      .from('EventRegistrations')
      .delete()
      .eq('eventId', id)
      .eq('userId', user.userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Successfully canceled event registration' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}