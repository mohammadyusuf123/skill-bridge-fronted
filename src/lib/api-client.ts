// // lib/apiClient.ts
// import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
// import { ApiResponse } from '@/types';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL 

// class ApiClient {
//   private client: AxiosInstance;

//   constructor() {
//     this.client = axios.create({
//       baseURL: BASE_URL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       withCredentials: true, // important! sends cookies automatically
//     });

//     // Request interceptor (optional)
//     this.client.interceptors.request.use(
//       (config) => config,
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     this.client.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError<ApiResponse>) => {
//         if (error.response?.status === 401) {
//           // Unauthorized → redirect to login
//           if (typeof window !== 'undefined') {
//             window.location.href = '/login';
//           }
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   // HTTP methods
//   async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
//     const response = await this.client.get<ApiResponse<T>>(url, config);
//     return response.data;
//   }

//   async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
//     const response = await this.client.post<ApiResponse<T>>(url, data, config);
//     return response.data;
//   }

//   async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
//     const response = await this.client.put<ApiResponse<T>>(url, data, config);
//     return response.data;
//   }

//   async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
//     const response = await this.client.patch<ApiResponse<T>>(url, data, config);
//     return response.data;
//   }

//   async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
//     const response = await this.client.delete<ApiResponse<T>>(url, config);
//     return response.data;
//   }

//   // Optional: for manual token (if you ever switch to JWT)
//   setAuthToken(token: string) {
//     this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   }

//   clearAuthToken() {
//     delete this.client.defaults.headers.common['Authorization'];
//   }
// }

// export const apiClient = new ApiClient();

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL 

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // better-auth manages auth via httpOnly cookies.  withCredentials ensures
    // the browser sends them on every cross-origin request automatically —
    // no manual token / sessionStorage plumbing needed.
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor — redirect to login on 401
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
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