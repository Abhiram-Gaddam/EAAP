// import { NextResponse } from 'next/server';
// import { verifyUser } from '@/app/lib/utilities/auth';
// import Razorpay from 'razorpay';

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export async function POST(request: Request) {
//   const user = await verifyUser();
//   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   try {
//     // Hardcoded membership fee (e.g., 50000 paise = 500 INR)
//     // Razorpay amount is always in the smallest currency unit (paise for INR)
//     const options = {
//       amount: 50000, 
//       currency: 'INR',
//       receipt: `receipt_${user.userId}_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     return NextResponse.json({ 
//       orderId: order.id, 
//       amount: order.amount, 
//       currency: order.currency 
//     }, { status: 200 });
    
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }