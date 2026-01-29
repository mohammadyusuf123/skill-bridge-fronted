import { apiClient } from '@/lib/api-client';
import { 
  Category, 
  CreateCategoryFormData,
  UpdateCategoryFormData,
  ApiResponse 
} from '@/types';

export const categoryApi = {
  // Get all categories
  getAllCategories: async (includeInactive: boolean = false): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories', {
      params: { includeInactive }
    });
  },

  // Get category by ID
  getCategoryById: async (categoryId: string): Promise<ApiResponse<Category>> => {
    return apiClient.get(`/categories/${categoryId}`);
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    return apiClient.get(`/categories/slug/${slug}`);
  },

  // Admin: Create new category
  createCategory: async (data: CreateCategoryFormData): Promise<ApiResponse<Category>> => {
    return apiClient.post('/categories', data);
  },

  // Admin: Update category
  updateCategory: async (
    categoryId: string,
    data: UpdateCategoryFormData
  ): Promise<ApiResponse<Category>> => {
    return apiClient.put(`/categories/${categoryId}`, data);
  },

  // Admin: Delete category
  deleteCategory: async (categoryId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete(`/categories/${categoryId}`);
  },

  // Admin: Toggle category status
  toggleCategoryStatus: async (categoryId: string): Promise<ApiResponse<Category>> => {
    return apiClient.patch(`/categories/${categoryId}/toggle-status`);
  },
};
