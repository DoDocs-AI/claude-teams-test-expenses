package com.expense.budget;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class BudgetRepository implements PanacheRepository<Budget> {

    public Optional<Budget> findByUserIdAndMonthAndYear(Long userId, int month, int year) {
        return find("user.id = ?1 and month = ?2 and year = ?3", userId, month, year).firstResultOptional();
    }
}
