'use client';

import { useState } from 'react';

// Utility to load the Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function MembershipCheckoutButton({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    // 1. Load the Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay failed to load. Please check your connection.');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call your Next.js backend to create the secure order
      const response = await fetch('/api/admin/membership/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const orderData = await response.json();
      console.log(response);
      
      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 3. Configure the Razorpay Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Safe to expose
        amount: orderData.amount, 
        currency: orderData.currency,
        name: 'Global Academy', 
        description: 'Lifetime Membership Fee',
        order_id: orderData.orderId, // The secure ID from your backend
        
        // 4. Handle the frontend success callback
        handler: async function (razorpayResponse: any) {
          console.log("Frontend Success:", razorpayResponse);
          alert('Payment Successful! Awaiting admin approval.');
          
          // Optional: Refresh the page or redirect to a success screen
          // window.location.reload();
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#10B981', // Your Peaceful Emerald green
        },
      };

      // 5. Open the modal
      const paymentObject = new (window as any).Razorpay(options);
      
      // Handle modal close event if the user cancels
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="px-6 py-3 font-semibold text-white transition-all rounded-lg shadow-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Processing...' : 'Pay ₹1500 for Lifetime Membership'}
    </button>
  );
}