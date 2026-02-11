package com.expense.budget;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class BudgetRequest {

    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    public Integer month;

    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be between 2000 and 2100")
    @Max(value = 2100, message = "Year must be between 2000 and 2100")
    public Integer year;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than 0")
    public BigDecimal amount;
}
