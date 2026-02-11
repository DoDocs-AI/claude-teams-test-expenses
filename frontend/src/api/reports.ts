import { apiClient } from './client';
import type { MonthlySummary, CategoryBreakdown, MonthlyTrend } from '../types';

export const reportsApi = {
  summary(params?: { month?: number; year?: number }): Promise<MonthlySummary> {
    return apiClient.get<MonthlySummary>('/reports/summary', params as Record<string, number>);
  },

  byCategory(params?: { month?: number; year?: number }): Promise<CategoryBreakdown[]> {
    return apiClient.get<CategoryBreakdown[]>('/reports/by-category', params as Record<string, number>);
  },

  monthlyTrend(params?: { year?: number }): Promise<MonthlyTrend[]> {
    return apiClient.get<MonthlyTrend[]>('/reports/monthly-trend', params as Record<string, number>);
  },
};
