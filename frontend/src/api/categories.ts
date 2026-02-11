import { apiClient } from './client';
import type { Category, CreateCategoryRequest } from '../types';

export const categoriesApi = {
  list(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },

  create(data: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`);
  },
};
