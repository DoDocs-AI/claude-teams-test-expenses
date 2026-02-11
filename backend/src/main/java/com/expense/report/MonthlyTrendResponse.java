package com.expense.report;

import java.math.BigDecimal;

public class MonthlyTrendResponse {
    public int month;
    public int year;
    public BigDecimal totalSpent;
    public long transactionCount;

    public MonthlyTrendResponse() {}

    public MonthlyTrendResponse(int month, int year, BigDecimal totalSpent, long transactionCount) {
        this.month = month;
        this.year = year;
        this.totalSpent = totalSpent;
        this.transactionCount = transactionCount;
    }
}
