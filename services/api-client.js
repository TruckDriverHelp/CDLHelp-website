import axios from 'axios';
import Cookies from 'js-cookie';

class APIClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.truckdriver.help';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    this.lastRequestMetadata = null;
    this.setupInterceptors();
  }
  
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = Cookies.get('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        // Add platform info
        config.headers['X-Platform'] = 'web';
        config.headers['X-Platform-Version'] = process.env.NEXT_PUBLIC_VERSION || '1.0.0';
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Handle new response format
        if (response.data?.status === 'success') {
          // Store metadata if needed
          this.lastRequestMetadata = response.data.metadata;
          return response.data.data;
        }
        
        // Fallback for old format (temporary)
        if (response.data?.success === true) {
          console.warn('Using deprecated response format');
          return response.data.data;
        }
        
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshToken();
            return this.client(originalRequest);
          } catch (refreshError) {
            // Redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }
        
        // Handle 429 - Rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 5;
          console.log(`Rate limited, retrying after ${retryAfter} seconds`);
          
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return this.client(originalRequest);
        }
        
        // Handle 422 - Validation errors
        if (error.response?.status === 422) {
          const errorData = error.response.data;
          const validationError = new Error(
            errorData.error?.message || 'Validation failed'
          );
          validationError.name = 'ValidationError';
          validationError.details = errorData.error?.details;
          throw validationError;
        }
        
        // Handle network errors
        if (!error.response) {
          const networkError = new Error('Network error. Please check your connection.');
          networkError.name = 'NetworkError';
          throw networkError;
        }
        
        // Handle server errors
        if (error.response?.status >= 500) {
          const serverError = new Error('Server error. Please try again later.');
          serverError.name = 'ServerError';
          throw serverError;
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  async refreshToken() {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await this.post('/api/auth/token/refresh', {
      refresh_token: refreshToken
    });
    
    Cookies.set('auth_token', response.access_token, { expires: 1 });
    Cookies.set('refresh_token', response.refresh_token, { expires: 7 });
    
    return response;
  }
  
  generateRequestId() {
    return `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // HTTP methods
  async get(url, config) {
    return this.client.get(url, config);
  }
  
  async post(url, data, config) {
    return this.client.post(url, data, config);
  }
  
  async put(url, data, config) {
    return this.client.put(url, data, config);
  }
  
  async patch(url, data, config) {
    return this.client.patch(url, data, config);
  }
  
  async delete(url, config) {
    return this.client.delete(url, config);
  }
}

// Export singleton instance
const apiClient = new APIClient();
export default apiClient;