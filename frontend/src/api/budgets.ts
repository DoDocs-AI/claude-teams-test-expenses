import { apiClient } from './client';
import type { Budget, BudgetRequest } from '../types';

export const budgetsApi = {
  getMonthly(params?: { month?: number; year?: number }): Promise<Budget> {
    return apiClient.get<Budget>('/budgets/monthly', params as Record<string, number>);
  },

  setMonthly(data: BudgetRequest): Promise<Budget> {
    return apiClient.put<Budget>('/budgets/monthly', data);
  },
};
