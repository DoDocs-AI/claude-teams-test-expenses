package com.expense.expense;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class ExpenseRepository implements PanacheRepository<Expense> {

    public List<Expense> findFiltered(Long userId, Long categoryId, LocalDate startDate, LocalDate endDate, int page, int size) {
        StringBuilder query = new StringBuilder("user.id = :userId");
        Parameters params = Parameters.with("userId", userId);

        if (categoryId != null) {
            query.append(" and category.id = :categoryId");
            params.and("categoryId", categoryId);
        }
        if (startDate != null) {
            query.append(" and date >= :startDate");
            params.and("startDate", startDate);
        }
        if (endDate != null) {
            query.append(" and date <= :endDate");
            params.and("endDate", endDate);
        }
        query.append(" order by date desc, id desc");

        return find(query.toString(), params).page(Page.of(page, size)).list();
    }

    public long countFiltered(Long userId, Long categoryId, LocalDate startDate, LocalDate endDate) {
        StringBuilder query = new StringBuilder("user.id = :userId");
        Parameters params = Parameters.with("userId", userId);

        if (categoryId != null) {
            query.append(" and category.id = :categoryId");
            params.and("categoryId", categoryId);
        }
        if (startDate != null) {
            query.append(" and date >= :startDate");
            params.and("startDate", startDate);
        }
        if (endDate != null) {
            query.append(" and date <= :endDate");
            params.and("endDate", endDate);
        }

        return count(query.toString(), params);
    }
}
