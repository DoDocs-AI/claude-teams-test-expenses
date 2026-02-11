package com.expense.budget;

import java.math.BigDecimal;

public class BudgetResponse {
    public Long id;
    public int month;
    public int year;
    public BigDecimal amount;
    public BigDecimal spent;
    public BigDecimal remaining;

    public BudgetResponse() {}
}
