package com.expense.category;

public class CategoryResponse {
    public Long id;
    public String name;
    public String icon;
    public boolean isDefault;

    public CategoryResponse() {}

    public CategoryResponse(Category category) {
        this.id = category.id;
        this.name = category.name;
        this.icon = category.icon;
        this.isDefault = category.isDefault;
    }
}
