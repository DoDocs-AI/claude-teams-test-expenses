package com.expense.budget;

import com.expense.auth.User;
import com.expense.auth.UserRepository;
import com.expense.common.NotFoundException;
import com.expense.expense.Expense;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Optional;

@ApplicationScoped
public class BudgetService {

    @Inject
    BudgetRepository budgetRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    EntityManager entityManager;

    public BudgetResponse getMonthlyBudget(Long userId, int month, int year) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        BigDecimal spent = calculateSpent(userId, month, year);

        BudgetResponse response = new BudgetResponse();
        response.month = month;
        response.year = year;
        response.spent = spent;

        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            response.id = budget.id;
            response.amount = budget.amount;
            response.remaining = budget.amount.subtract(spent);
        }

        return response;
    }

    @Transactional
    public BudgetResponse setMonthlyBudget(Long userId, BudgetRequest request) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        Optional<Budget> existing = budgetRepository.findByUserIdAndMonthAndYear(userId, request.month, request.year);
        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.amount = request.amount;
        } else {
            budget = new Budget();
            budget.user = user;
            budget.month = request.month;
            budget.year = request.year;
            budget.amount = request.amount;
            budgetRepository.persist(budget);
        }

        BigDecimal spent = calculateSpent(userId, request.month, request.year);
        BudgetResponse response = new BudgetResponse();
        response.id = budget.id;
        response.month = budget.month;
        response.year = budget.year;
        response.amount = budget.amount;
        response.spent = spent;
        response.remaining = budget.amount.subtract(spent);
        return response;
    }

    private BigDecimal calculateSpent(Long userId, int month, int year) {
        Object result = entityManager.createQuery(
                        "SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId " +
                                "AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year")
                .setParameter("userId", userId)
                .setParameter("month", month)
                .setParameter("year", year)
                .getSingleResult();
        return (BigDecimal) result;
    }
}
