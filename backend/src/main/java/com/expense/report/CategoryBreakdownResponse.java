package com.expense.report;

import java.math.BigDecimal;

public class CategoryBreakdownResponse {
    public CategoryInfo category;
    public BigDecimal totalAmount;
    public long transactionCount;
    public double percentage;

    public static class CategoryInfo {
        public Long id;
        public String name;
        public String icon;

        public CategoryInfo() {}
    }
}
