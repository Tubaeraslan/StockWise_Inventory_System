package com.stockwise.backend.category;

import com.stockwise.backend.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final com.stockwise.backend.user.UserActivityLogService userActivityLogService;

    public CategoryService(CategoryRepository categoryRepository, com.stockwise.backend.user.UserActivityLogService userActivityLogService) {
        this.categoryRepository = categoryRepository;
        this.userActivityLogService = userActivityLogService;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request, Long userId) {
        categoryRepository.findByNameIgnoreCase(request.name()).ifPresent(existing -> {
            throw new IllegalArgumentException("Category already exists: " + request.name());
        });

        Category category = new Category();
        category.setName(request.name().trim());
        category.setDescription(request.description());
        Category saved = categoryRepository.save(category);
        userActivityLogService.log(userId, "CATEGORY_CREATE: " + saved.getName());
        return toResponse(saved);
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request, Long userId) {
        Category category = getEntity(id);
        category.setName(request.name().trim());
        category.setDescription(request.description());
        Category saved = categoryRepository.save(category);
        userActivityLogService.log(userId, "CATEGORY_UPDATE: " + saved.getName());
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Category category = getEntity(id);
        categoryRepository.delete(category);
        userActivityLogService.log(userId, "CATEGORY_DELETE: " + category.getName());
    }

    @Transactional(readOnly = true)
    public Category getEntity(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }
}
