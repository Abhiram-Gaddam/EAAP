// src/app/api/public/inquiries/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';
import { verifyUser } from '@/app/lib/utilities/auth'; // Import your auth utility

export async function POST(request: Request) {
  try {
    // 1. Securely check if a valid session exists on the server
    const authSession = await verifyUser();
    // If they are logged in, grab the real ID. If not, it stays null (Guest).
    const serverSideUserId = authSession ? authSession.userId : null;

    const body = await request.json();
    
    // 2. We no longer destructure 'userId' from the body!
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Inquiries')
      .insert([{ 
        name, 
        email, 
        subject: subject || 'No Subject', 
        message, 
        // 3. Use the server-verified ID securely
        userId: serverSideUserId, 
        status: 'NEW' 
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Inquiry submitted successfully', inquiry: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}