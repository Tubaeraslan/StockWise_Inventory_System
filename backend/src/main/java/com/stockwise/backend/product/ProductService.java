package com.stockwise.backend.product;

import com.stockwise.backend.category.Category;
import com.stockwise.backend.category.CategoryService;
import com.stockwise.backend.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAll(String name) {
        List<Product> products = (name == null || name.isBlank())
            ? productRepository.findAll()
            : productRepository.findByNameContainingIgnoreCase(name.trim());
        return products.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getEntity(id);
        applyRequest(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = getEntity(id);
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public Product getEntity(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private void applyRequest(Product product, ProductRequest request) {
        Category category = categoryService.getEntity(request.categoryId());
        product.setName(request.name().trim());
        product.setQuantity(request.quantity());
        product.setThreshold(request.threshold());
        product.setPrice(request.price());
        product.setCategory(category);
    }

    private ProductResponse toResponse(Product product) {
        boolean lowStock = product.getQuantity() <= product.getThreshold();
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getQuantity(),
            product.getThreshold(),
            product.getPrice(),
            product.getCategory().getId(),
            product.getCategory().getName(),
            lowStock
        );
    }
}
