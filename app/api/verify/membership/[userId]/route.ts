// app/api/verify/membership/[userId]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/utilities/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;

    const { data: membership, error } = await supabase
      .from('MembershipDetails')
      .select('id, status, createdAt, User(fullName)')
      .eq('userId', userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
    }

    if (!membership) {
      return NextResponse.json({ valid: false, error: 'Membership not found' }, { status: 404 });
    }

    if (membership.status !== 'APPROVED') {
      return NextResponse.json({ valid: false, error: 'Membership is not active' }, { status: 400 });
    }

    const userName = Array.isArray(membership.User) 
      ? (membership.User[0] as any)?.fullName 
      : (membership.User as any)?.fullName;

    return NextResponse.json({
      valid: true,
      data: {
        name: userName,
        membershipId: `MEM-${membership.id.split('-')[0].toUpperCase()}`,
        status: membership.status,
        memberSince: membership.createdAt
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}