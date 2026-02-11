package com.expense.category;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CategoryRepository implements PanacheRepository<Category> {

    public List<Category> findDefaults() {
        return list("isDefault", true);
    }

    public List<Category> findByUserId(Long userId) {
        return list("user.id", userId);
    }

    public Optional<Category> findByNameAndUserId(String name, Long userId) {
        return find("name = ?1 and user.id = ?2", name, userId).firstResultOptional();
    }

    public Optional<Category> findDefaultByName(String name) {
        return find("name = ?1 and isDefault = true", name).firstResultOptional();
    }
}
