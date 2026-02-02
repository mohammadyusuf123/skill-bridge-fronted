import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

class ApiClient {
  private client: AxiosInstance;
  private jwtToken: string | null = null;

  constructor() {
    // better-auth manages auth via httpOnly cookies.  withCredentials ensures
    // the browser sends them on every cross-origin request automatically.
    // We also add JWT Bearer tokens for the backend API.
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor — add JWT Bearer token if available
    this.client.interceptors.request.use(
      (config) => {
        if (this.jwtToken) {
          config.headers.Authorization = `Bearer ${this.jwtToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — redirect to login on 401, try token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to get a fresh token from the backend
          try {
            const tokenResponse = await fetch('/api/auth/get-backend-token');
            if (tokenResponse.ok) {
              const { token } = await tokenResponse.json();
              if (token) {
                this.setToken(token);
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            // Token refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }

          // If we get here, token refresh failed
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Set the JWT token
  setToken(token: string | null) {
    this.jwtToken = token;
  }

  // Get the current token
  getToken(): string | null {
    return this.jwtToken;
  }

  // Clear the token
  clearToken() {
    this.jwtToken = null;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

}

export const apiClient = new ApiClient();