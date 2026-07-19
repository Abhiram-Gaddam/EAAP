// app/lib/utilities/apis.ts

export async function loginUser(credentials: Record<string, string>): Promise<any> {
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to login'); }
    return response.json();
  }
  
  export async function getCurrentUser(): Promise<any> {
    const response = await fetch('/api/auth/me', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Not authenticated'); }
    return response.json();
  }
  
  export async function logoutUser(): Promise<any> {
    const response = await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  }
  
  // User Dashboard APIs
  export async function getUserDashboard(): Promise<any> {
    const response = await fetch('/api/user/dashboard', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to fetch dashboard data'); }
    return response.json();
  }
   

  export async function getUserCertificates(): Promise<any> {
    const response = await fetch('/api/user/certificates', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to fetch certificates'); }
    return response.json();
  }
  
  export async function getUserMembership(): Promise<any> {
    const response = await fetch('/api/user/membership', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to fetch membership'); }
    return response.json();
  }
  
  export async function payMembership(paymentData: any): Promise<any> {
    const response = await fetch('/api/user/membership/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentData) });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to process payment'); }
    return response.json();
  }
    

export async function getUserEvents(): Promise<any> {
    const response = await fetch('/api/user/events', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user events');
    }
    return response.json();
  }
  
  export async function getUserEventDetails(id: string): Promise<any> {
    const response = await fetch(`/api/user/events/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch event details');
    }
    return response.json();
  }
  
  export async function registerForEvent(id: string): Promise<any> {
    const response = await fetch(`/api/user/events/${id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register for event');
    }
    return response.json();
  }
  
  export async function cancelEventRegistration(id: string): Promise<any> {
    const response = await fetch(`/api/user/events/${id}/register`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel registration');
    }
    return response.json();
  }

  export async function renderEventCertificate(eventId: string): Promise<any> {
    // Notice we use the new user-specific route without the userId in the URL
    const response = await fetch(`/api/user/certificates/${eventId}/render`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to load certificate data');
    }
    
    return response.json();
  }

  // app/lib/utilities/userApis.ts

export async function getUserPublications(): Promise<any> {
  const response = await fetch('/api/user/publications', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to fetch publications'); }
  return response.json();
}

export async function createUserPublication(formData: FormData): Promise<any> {
  const response = await fetch('/api/user/publications', { method: 'POST', body: formData });
  if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to create draft'); }
  return response.json();
}

export async function getUserPublicationDetails(id: string): Promise<any> {
  const response = await fetch(`/api/user/publications/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to fetch publication details'); }
  return response.json();
}

export async function updateUserPublication(id: string, formData: FormData): Promise<any> {
  const response = await fetch(`/api/user/publications/${id}`, { method: 'PUT', body: formData });
  if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to update publication'); }
  return response.json();
}

export async function deleteUserPublication(id: string): Promise<any> {
  const response = await fetch(`/api/user/publications/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to delete publication'); }
  return response.json();
}

export async function submitUserPublicationForReview(id: string): Promise<any> {
  const response = await fetch(`/api/user/publications/${id}/submit`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to submit for review'); }
  return response.json();
}

// app/lib/utilities/userApis.ts

export async function getUserProfile(): Promise<any> {
  const response = await fetch('/api/user/profile', { 
    method: 'GET', 
    headers: { 'Content-Type': 'application/json' } 
  });
  if (!response.ok) { 
    const errorData = await response.json(); 
    throw new Error(errorData.error || 'Failed to fetch profile'); 
  }
  return response.json();
}

export async function updateUserProfile(formData: FormData): Promise<any> {
  const response = await fetch('/api/user/profile', { 
    method: 'PUT', 
    body: formData 
  });
  if (!response.ok) { 
    const errorData = await response.json(); 
    throw new Error(errorData.error || 'Failed to update profile'); 
  }
  return response.json();
}

// app/lib/utilities/apis.ts

export async function submitInquiry(data: { name: string; email: string; subject: string; message: string; userId?: string }): Promise<any> {
  const response = await fetch('/api/user/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit inquiry');
  }
  return response.json();
}

export async function getAdminInquiries(status?: string): Promise<any> {
  const url = status && status !== 'ALL' ? `/api/admin/inquiries?status=${status}` : '/api/admin/inquiries';
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch inquiries');
  return response.json();
}

export async function updateInquiryStatus(id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED'): Promise<any> {
  const response = await fetch(`/api/admin/inquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
  return response.json();
}

export async function deleteInquiry(id: string): Promise<any> {
  const response = await fetch(`/api/admin/inquiries/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete inquiry');
  return response.json();
}
// app/lib/utilities/apis.ts (Add this export)
export async function getPublicEvents(category?: string): Promise<any> {
  const response = await fetch('/api/public/events', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch public events');
  }
  
  return response.json();
}

// app/lib/utilities/apis.ts

export async function getPublicEventDetails(id: string): Promise<any> {
  const response = await fetch(`/api/public/events/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch public event details');
  }
  return response.json();
}

// app/lib/utilities/apis.ts

export async function getPublicPublications(): Promise<any> {
  const response = await fetch('/api/public/publications', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch public publications');
  }
  return response.json();
}

export async function getPublicPublicationDetails(id: string): Promise<any> {
  const response = await fetch(`/api/public/publications/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch public publication details');
  }
  return response.json();
}

export async function getMembershipCertificate(userId: string): Promise<any> {
  const response = await fetch(`/api/user/membership/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch membership certificate');
  }
  return response.json();
}