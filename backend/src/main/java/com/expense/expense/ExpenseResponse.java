package com.expense.expense;

import com.expense.category.CategoryResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseResponse {
    public Long id;
    public BigDecimal amount;
    public CategoryResponse category;
    public LocalDate date;
    public String description;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public ExpenseResponse() {}

    public ExpenseResponse(Expense expense) {
        this.id = expense.id;
        this.amount = expense.amount;
        this.category = new CategoryResponse(expense.category);
        this.date = expense.date;
        this.description = expense.description;
        this.createdAt = expense.createdAt;
        this.updatedAt = expense.updatedAt;
    }
}
