package com.expense.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 1, max = 50, message = "Category name must be between 1 and 50 characters")
    public String name;

    @Size(max = 50, message = "Icon must be at most 50 characters")
    public String icon;
}
