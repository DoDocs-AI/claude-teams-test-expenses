package com.expense.expense;

import com.expense.auth.User;
import com.expense.auth.UserRepository;
import com.expense.category.Category;
import com.expense.category.CategoryRepository;
import com.expense.common.NotFoundException;
import com.expense.common.PaginatedResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ExpenseService {

    @Inject
    ExpenseRepository expenseRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Transactional
    public ExpenseResponse createExpense(Long userId, CreateExpenseRequest request) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        Category category = categoryRepository.findById(request.categoryId);
        if (category == null) {
            throw new NotFoundException("Category not found");
        }
        // Verify category is accessible: must be default or owned by this user
        if (!category.isDefault && (category.user == null || !category.user.id.equals(userId))) {
            throw new NotFoundException("Category not found");
        }

        Expense expense = new Expense();
        expense.user = user;
        expense.category = category;
        expense.amount = request.amount;
        expense.date = request.date;
        expense.description = request.description;
        expenseRepository.persist(expense);

        return new ExpenseResponse(expense);
    }

    public ExpenseResponse getExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId);
        if (expense == null || !expense.user.id.equals(userId)) {
            throw new NotFoundException("Expense not found");
        }
        return new ExpenseResponse(expense);
    }

    public PaginatedResponse<ExpenseResponse> getExpenses(Long userId, Long categoryId, LocalDate startDate, LocalDate endDate, int page, int size) {
        List<Expense> expenses = expenseRepository.findFiltered(userId, categoryId, startDate, endDate, page, size);
        long total = expenseRepository.countFiltered(userId, categoryId, startDate, endDate);
        List<ExpenseResponse> content = expenses.stream().map(ExpenseResponse::new).collect(Collectors.toList());
        return new PaginatedResponse<>(content, page, size, total);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long userId, Long expenseId, CreateExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId);
        if (expense == null || !expense.user.id.equals(userId)) {
            throw new NotFoundException("Expense not found");
        }

        Category category = categoryRepository.findById(request.categoryId);
        if (category == null) {
            throw new NotFoundException("Category not found");
        }
        if (!category.isDefault && (category.user == null || !category.user.id.equals(userId))) {
            throw new NotFoundException("Category not found");
        }

        expense.category = category;
        expense.amount = request.amount;
        expense.date = request.date;
        expense.description = request.description;
        expenseRepository.persist(expense);

        return new ExpenseResponse(expense);
    }

    @Transactional
    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId);
        if (expense == null || !expense.user.id.equals(userId)) {
            throw new NotFoundException("Expense not found");
        }
        expenseRepository.delete(expense);
    }
}
