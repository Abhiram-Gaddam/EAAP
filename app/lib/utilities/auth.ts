import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

export async function verifyAdmin(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    
    if (decoded.role !== 'ADMIN') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function verifyUser(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (error) {
    return null;
  }
}