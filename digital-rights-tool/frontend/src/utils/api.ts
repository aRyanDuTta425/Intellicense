// Fetch-based API client
import { API_URL } from './config';

// Base API URL
const baseURL = API_URL;

// Log the base URL for debugging
console.log('API Base URL:', baseURL);

// Helper to handle unauthorized responses
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Only redirect if not already on the login page to avoid loops
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/register') {
    window.location.href = '/login';
  }
};

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }
    
    let errorMessage = 'An error occurred';
    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Helper to ensure endpoint has /api prefix
const ensureApiPrefix = (endpoint: string) => {
  return endpoint.startsWith('/api/') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Main API object with methods for different HTTP verbs
const api = {
  // GET request
  async get(endpoint: string) {
    const apiEndpoint = ensureApiPrefix(endpoint);
    console.log('Making GET request to:', `${baseURL}${apiEndpoint}`);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseURL}${apiEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('GET request failed:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('CORS or network error detected. Check if the backend is running and CORS is properly configured.');
      }
      throw error;
    }
  },
  
  // POST request
  async post(endpoint: string, data: any) {
    const apiEndpoint = ensureApiPrefix(endpoint);
    console.log('Making POST request to:', `${baseURL}${apiEndpoint}`);
    console.log('Request data:', data);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseURL}${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('POST request failed:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('CORS or network error detected. Check if the backend is running and CORS is properly configured.');
      }
      throw error;
    }
  },
  
  // PUT request
  async put(endpoint: string, data: any) {
    const apiEndpoint = ensureApiPrefix(endpoint);
    console.log('Making PUT request to:', `${baseURL}${apiEndpoint}`);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseURL}${apiEndpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('PUT request failed:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('CORS or network error detected. Check if the backend is running and CORS is properly configured.');
      }
      throw error;
    }
  },
  
  // DELETE request
  async delete(endpoint: string) {
    const apiEndpoint = ensureApiPrefix(endpoint);
    console.log('Making DELETE request to:', `${baseURL}${apiEndpoint}`);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseURL}${apiEndpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('DELETE request failed:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('CORS or network error detected. Check if the backend is running and CORS is properly configured.');
      }
      throw error;
    }
  },
  
  // File upload
  async uploadFile(endpoint: string, file: File) {
    const apiEndpoint = ensureApiPrefix(endpoint);
    console.log('Making file upload request to:', `${baseURL}${apiEndpoint}`);
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${baseURL}${apiEndpoint}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
        credentials: 'include'
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('File upload failed:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('CORS or network error detected. Check if the backend is running and CORS is properly configured.');
      }
      throw error;
    }
  }
};

export default api;
