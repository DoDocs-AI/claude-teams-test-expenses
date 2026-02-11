import { apiClient } from './client';
import type {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  PaginatedResponse,
} from '../types';

export const expensesApi = {
  list(params?: {
    category?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Expense>> {
    return apiClient.get<PaginatedResponse<Expense>>('/expenses', params as Record<string, string | number | undefined>);
  },

  get(id: number): Promise<Expense> {
    return apiClient.get<Expense>(`/expenses/${id}`);
  },

  create(data: CreateExpenseRequest): Promise<Expense> {
    return apiClient.post<Expense>('/expenses', data);
  },

  update(id: number, data: UpdateExpenseRequest): Promise<Expense> {
    return apiClient.put<Expense>(`/expenses/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/expenses/${id}`);
  },
};
