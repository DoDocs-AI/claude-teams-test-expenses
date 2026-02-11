export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  isDefault: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  icon?: string;
}

export interface Expense {
  id: number;
  amount: number;
  category: Category;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  amount: number;
  categoryId: number;
  date: string;
  description?: string;
}

export interface UpdateExpenseRequest {
  amount: number;
  categoryId: number;
  date: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Budget {
  id: number | null;
  month: number;
  year: number;
  amount: number | null;
  spent: number;
  remaining: number | null;
}

export interface BudgetRequest {
  month: number;
  year: number;
  amount: number;
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalSpent: number;
  transactionCount: number;
  topCategory: (Category & { amount: number }) | null;
  budgetAmount: number | null;
  budgetRemaining: number | null;
}

export interface CategoryBreakdown {
  category: Category;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: number;
  year: number;
  totalSpent: number;
  transactionCount: number;
}

export interface ApiError {
  error: string;
  message: string;
}
