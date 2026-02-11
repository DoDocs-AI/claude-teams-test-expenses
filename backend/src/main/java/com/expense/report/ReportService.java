package com.expense.report;

import com.expense.budget.Budget;
import com.expense.budget.BudgetRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ReportService {

    @Inject
    EntityManager entityManager;

    @Inject
    BudgetRepository budgetRepository;

    public MonthlySummaryResponse getMonthlySummary(Long userId, int month, int year) {
        MonthlySummaryResponse response = new MonthlySummaryResponse();
        response.month = month;
        response.year = year;

        // Total spent and count
        Object[] totals = (Object[]) entityManager.createQuery(
                        "SELECT COALESCE(SUM(e.amount), 0), COUNT(e.id) FROM Expense e " +
                                "WHERE e.user.id = :userId AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year")
                .setParameter("userId", userId)
                .setParameter("month", month)
                .setParameter("year", year)
                .getSingleResult();
        response.totalSpent = (BigDecimal) totals[0];
        response.transactionCount = (Long) totals[1];

        // Top category
        @SuppressWarnings("unchecked")
        List<Object[]> topCategoryResults = entityManager.createQuery(
                        "SELECT e.category.id, e.category.name, e.category.icon, SUM(e.amount) as total " +
                                "FROM Expense e WHERE e.user.id = :userId " +
                                "AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year " +
                                "GROUP BY e.category.id, e.category.name, e.category.icon ORDER BY total DESC")
                .setParameter("userId", userId)
                .setParameter("month", month)
                .setParameter("year", year)
                .setMaxResults(1)
                .getResultList();

        if (!topCategoryResults.isEmpty()) {
            Object[] tc = topCategoryResults.get(0);
            MonthlySummaryResponse.TopCategoryInfo topCategory = new MonthlySummaryResponse.TopCategoryInfo();
            topCategory.id = (Long) tc[0];
            topCategory.name = (String) tc[1];
            topCategory.icon = (String) tc[2];
            topCategory.amount = (BigDecimal) tc[3];
            response.topCategory = topCategory;
        }

        // Budget info
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        if (budgetOpt.isPresent()) {
            response.budgetAmount = budgetOpt.get().amount;
            response.budgetRemaining = budgetOpt.get().amount.subtract(response.totalSpent);
        }

        return response;
    }

    public List<CategoryBreakdownResponse> getSpendingByCategory(Long userId, int month, int year) {
        @SuppressWarnings("unchecked")
        List<Object[]> results = entityManager.createQuery(
                        "SELECT e.category.id, e.category.name, e.category.icon, SUM(e.amount), COUNT(e.id) " +
                                "FROM Expense e WHERE e.user.id = :userId " +
                                "AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year " +
                                "GROUP BY e.category.id, e.category.name, e.category.icon ORDER BY SUM(e.amount) DESC")
                .setParameter("userId", userId)
                .setParameter("month", month)
                .setParameter("year", year)
                .getResultList();

        BigDecimal totalSpent = results.stream()
                .map(r -> (BigDecimal) r[3])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategoryBreakdownResponse> breakdown = new ArrayList<>();
        for (Object[] row : results) {
            CategoryBreakdownResponse item = new CategoryBreakdownResponse();
            item.category = new CategoryBreakdownResponse.CategoryInfo();
            item.category.id = (Long) row[0];
            item.category.name = (String) row[1];
            item.category.icon = (String) row[2];
            item.totalAmount = (BigDecimal) row[3];
            item.transactionCount = (Long) row[4];
            item.percentage = totalSpent.compareTo(BigDecimal.ZERO) > 0
                    ? item.totalAmount.multiply(BigDecimal.valueOf(100)).divide(totalSpent, 1, RoundingMode.HALF_UP).doubleValue()
                    : 0.0;
            breakdown.add(item);
        }
        return breakdown;
    }

    public List<MonthlyTrendResponse> getMonthlyTrend(Long userId, int year) {
        @SuppressWarnings("unchecked")
        List<Object[]> results = entityManager.createQuery(
                        "SELECT EXTRACT(MONTH FROM e.date), SUM(e.amount), COUNT(e.id) " +
                                "FROM Expense e WHERE e.user.id = :userId AND EXTRACT(YEAR FROM e.date) = :year " +
                                "GROUP BY EXTRACT(MONTH FROM e.date) ORDER BY EXTRACT(MONTH FROM e.date)")
                .setParameter("userId", userId)
                .setParameter("year", year)
                .getResultList();

        // Build full 12-month list
        List<MonthlyTrendResponse> trend = new ArrayList<>();
        java.util.Map<Integer, Object[]> monthData = new java.util.HashMap<>();
        for (Object[] row : results) {
            int m = ((Number) row[0]).intValue();
            monthData.put(m, row);
        }

        for (int m = 1; m <= 12; m++) {
            if (monthData.containsKey(m)) {
                Object[] row = monthData.get(m);
                trend.add(new MonthlyTrendResponse(m, year, (BigDecimal) row[1], (Long) row[2]));
            } else {
                trend.add(new MonthlyTrendResponse(m, year, BigDecimal.ZERO, 0));
            }
        }
        return trend;
    }
}
