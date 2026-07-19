/**
 * Frontend API service for authentication and registration.
 */

/**
 * Sends a POST request to the login endpoint.
 * Requires email and password in the JSON body to authenticate the user and set an HttpOnly JWT cookie[cite: 1].
 * 
 * @param {Object} credentials - The login credentials.
 * @param {string} credentials.email - The user's email address[cite: 1].
 * @param {string} credentials.password - The user's password[cite: 1].
 * @returns {Promise<any>} The response containing the success message and user data[cite: 1].
 */
export async function loginUser(credentials: Record<string, string>): Promise<any> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to login');
    }
  
    return response.json();
  }
  
  /**
   * Sends a GET request to verify the current session.
   * Uses the HTTP-only JWT cookie to decode and return the authenticated user's information[cite: 2].
   * 
   * @returns {Promise<any>} The response containing the decoded JWT user data[cite: 2].
   */
  export async function getCurrentUser(): Promise<any> {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Not authenticated');
    }
  
    return response.json();
  }
  
  /**
   * Sends a POST request to the registration endpoint using FormData.
   * Submits text fields (fullName, phone, cityDistrict, email, password, highestQualification, currentDesignation, currentHospital, clinicalEmbryologyExpYrs) and files (eduCertificate, expCertificate, photo, govId)[cite: 3].
   * The server handles AWS S3 uploads and Supabase database insertions[cite: 3].
   * 
   * @param {FormData} formData - The multipart form data containing all user registration details and required documents[cite: 3].
   * @returns {Promise<any>} The response containing a success message and the newly created userId[cite: 3].
   */
  export async function registerUser(formData: FormData): Promise<any> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      // Do NOT set 'Content-Type' when sending FormData; the browser sets the correct multipart/form-data boundary automatically.
      body: formData,
    });
  
    if (!response.ok) {
      const errorData = await response.json();
       throw new Error(errorData.error || 'Registration failed');
    }
  
    return response.json();
  }

  export async function logoutUser(): Promise<any> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  
    return response.json();
  }

  export async function getAdminDashboard(): Promise<any> {
    const response = await fetch('/api/admin/dashboard', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch admin dashboard data');
    }
    
    return response.json();
  }

  export async function getAllApplications(): Promise<any> {
    const response = await fetch('/api/admin/applications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch applications');
    }
  
    return response.json();
  }
  
  export async function getApplicationDetails(id: string): Promise<any> {
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch application details');
    }
  
    return response.json();
  }
  
  export async function updateApplicationStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<any> {
    if (!id) throw new Error("Application ID is required");
    const response = await fetch(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update application status');
    }
  
    return response.json();
  }
  export async function deleteApplication(id: string): Promise<any> {
    if (!id) throw new Error("Application ID is required");
  
    const response = await fetch(`/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete application');
    }
  
    return response.json();
  }

  // app/lib/utilities/apis.ts
// Add these functions to your existing apis.ts file

export async function getDirectoryMembers(): Promise<any> {
  const response = await fetch('/api/admin/directory', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch directory members');
  }

  return response.json();
}

export async function getMemberProfile(id: string): Promise<any> {
  const response = await fetch(`/api/admin/directory/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch member profile');
  }

  return response.json();
}
export async function getAllEvents(): Promise<any> {
  const response = await fetch('/api/admin/events', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

export async function getTopEvents(): Promise<any> {
  const response = await fetch('/api/admin/events/top', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch top events');
  return response.json();
}

export async function getEventDetails(id: string): Promise<any> {
  const response = await fetch(`/api/admin/events/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch event details');
  return response.json();
}

export async function createEvent(eventData: any): Promise<any> {
  const response = await fetch('/api/admin/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error('Failed to create event');
  return response.json();
}

export async function updateEvent(id: string, eventData: any): Promise<any> {
  const response = await fetch(`/api/admin/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error('Failed to update event');
  return response.json();
}

export async function deleteEvent(id: string): Promise<any> {
  const response = await fetch(`/api/admin/events/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete event');
  return response.json();
}

// --- NEW APIS ADDED BELOW ---

export async function uploadEventPhotos(id: string, formData: FormData): Promise<any> {
  const response = await fetch(`/api/admin/events/${id}/photos`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload event photos');
  }
  return response.json();
}
 
export async function generateEventCertificates(id: string): Promise<any> {
  const response = await fetch(`/api/admin/events/${id}/cert/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate certificates');
  }
  return response.json();
}

export async function createCertificateTemplate(formData: FormData): Promise<any> {
  const response = await fetch('/api/admin/cert/temp', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create certificate template');
  }
  return response.json();
}

export async function getCertificateTemplates(): Promise<any> {
  const response = await fetch('/api/admin/cert/temp', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch certificate templates');
  }
  console.log(response)
  return response.json();
}

export async function getCertificateTemplate(id: string): Promise<any> {
  const response = await fetch(`/api/admin/cert/temp/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch template details');
  }
  return response.json();
}

 
export async function previewCertificateTemplate(templateId: string): Promise<any> {
  const response = await fetch(`/api/admin/cert/temp/${templateId}/preview`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate preview');
  }
  return response.json(); // Returns { backgroundUrl, renderData }
}

export async function getUserCertificateData(eventId: string, userId: string): Promise<any> {
  const response = await fetch(`/api/admin/events/${eventId}/certificates/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user certificate data');
  }
  return response.json(); // Returns { backgroundUrl, renderData }
}

export async function downloadUserCertificate(eventId: string, userId: string): Promise<any> {
  const response = await fetch(`/api/admin/events/${eventId}/cert/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to download certificate');
  }
  return response.json();
}

export async function updateCertificateTemplate(id: string, data: any): Promise<any> {
  const response = await fetch(`/api/admin/cert/temp/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update template');
  }
  return response.json();
}

export async function deleteCertificateTemplate(id: string): Promise<any> {
  const response = await fetch(`/api/admin/cert/temp/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete template');
  }
  return response.json();
}
export async function issueCertificates(eventId: string): Promise<any> {
  const response = await fetch(`/api/admin/cert/temp/${eventId}/issue-certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to issue certificates');
  }
  return response.json();
}

// app/lib/utilities/apis.ts
 
export async function getAllAdminPublications(status?: string): Promise<any> {
  const url = status ? `/api/admin/publications?status=${status}` : '/api/admin/publications';
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to fetch publications');
  return response.json();
}

export async function getAdminPublicationDetails(id: string): Promise<any> {
  const response = await fetch(`/api/admin/publications/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch publication details');
  }
  return response.json();
}

export async function updatePublicationStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<any> {
  const response = await fetch(`/api/admin/publications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update status');
  }
  return response.json();
}

export async function updatePublicationMetadata(id: string, data: any): Promise<any> {
  const response = await fetch(`/api/admin/publications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update metadata');
  }
  return response.json();
}

export async function deletePublication(id: string): Promise<any> {
  const response = await fetch(`/api/admin/publications/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete publication');
  }
  return response.json();
}

export async function adminCreatePublication(formData: FormData): Promise<any> {
  const response = await fetch('/api/admin/publications', {
    method: 'POST',
    body: formData, // FormData handles headers automatically
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create publication');
  }
  return response.json();
}

// export async function updatePublicationStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<any> {
//   const response = await fetch(`/api/admin/publications/${id}/status`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ status }),
//   });
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to update status');
//   }
//   return response.json();
// }

// export async function updatePublicationMetadata(id: string, data: any): Promise<any> {
//   const response = await fetch(`/api/admin/publications/${id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || 'Failed to update metadata');
//   }
//   return response.json();
// }
 

export async function getSecurePublicationDownloadUrl(id: string): Promise<any> {
  const response = await fetch(`/api/admin/publications/${id}/download`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate download URL');
  }
  return response.json();
}

export async function markUserAttendance(eventId: string, userId: string, attended: boolean) {
  const response = await fetch(`/api/admin/events/${eventId}/attendance`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, attended }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update attendance');
  }
  
  return response.json();
}