const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000/api`;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('welile_token');

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Basic automatic logout handling if token expires
    localStorage.removeItem('welile_token');
    localStorage.removeItem('welile_user');
    window.dispatchEvent(new Event('welile_auth_change'));
    // Redirect logic handled by AuthProvider or React Router generally
  }

  // If you expect JSON responses everywhere, you could auto-parse here,
  // but let's keep it close to standard fetch signature.
  return response;
}
