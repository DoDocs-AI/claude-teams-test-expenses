package com.expense.expense;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateExpenseRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than 0")
    public BigDecimal amount;

    @NotNull(message = "Category ID is required")
    public Long categoryId;

    @NotNull(message = "Date is required")
    public LocalDate date;

    @Size(max = 500, message = "Description must be at most 500 characters")
    public String description;
}
