package com.expense.report;

import com.expense.category.CategoryResponse;
import java.math.BigDecimal;

public class MonthlySummaryResponse {
    public int month;
    public int year;
    public BigDecimal totalSpent;
    public long transactionCount;
    public TopCategoryInfo topCategory;
    public BigDecimal budgetAmount;
    public BigDecimal budgetRemaining;

    public static class TopCategoryInfo {
        public Long id;
        public String name;
        public String icon;
        public BigDecimal amount;

        public TopCategoryInfo() {}
    }
}
