package com.expense.category;

import com.expense.common.ConflictException;
import com.expense.common.NotFoundException;
import com.expense.auth.User;
import com.expense.auth.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CategoryService {

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    UserRepository userRepository;

    public List<CategoryResponse> getAllForUser(Long userId) {
        List<Category> defaults = categoryRepository.findDefaults();
        List<Category> custom = categoryRepository.findByUserId(userId);
        List<Category> all = new ArrayList<>(defaults);
        all.addAll(custom);
        return all.stream().map(CategoryResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCustomCategory(Long userId, CreateCategoryRequest request) {
        // Check uniqueness among user's custom categories
        if (categoryRepository.findByNameAndUserId(request.name, userId).isPresent()) {
            throw new ConflictException("A category with this name already exists");
        }
        // Also check against default categories
        if (categoryRepository.findDefaultByName(request.name).isPresent()) {
            throw new ConflictException("A category with this name already exists");
        }

        User user = userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        Category category = new Category();
        category.name = request.name;
        category.icon = request.icon;
        category.isDefault = false;
        category.user = user;
        categoryRepository.persist(category);

        return new CategoryResponse(category);
    }
}
