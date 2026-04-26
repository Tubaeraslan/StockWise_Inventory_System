package com.stockwise.backend.product;

import com.stockwise.backend.category.Category;
import com.stockwise.backend.category.CategoryService;
import com.stockwise.backend.common.ResourceNotFoundException;
import com.stockwise.backend.user.StockUser;
import com.stockwise.backend.user.UserService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final com.stockwise.backend.alert.AlertService alertService;
    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final SaleRepository saleRepository;

    public ProductService(ProductRepository productRepository, CategoryService categoryService, UserService userService, com.stockwise.backend.alert.AlertService alertService, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        this.alertService = alertService;
        this.saleRepository = saleRepository;
    }
    @Transactional
    public ProductResponse sellProduct(Long productId, int amount, Long userId) {
        if (amount <= 0) throw new IllegalArgumentException("Satış miktarı pozitif olmalı");
        Product product = getEntity(productId);
        if (product.getQuantity() < amount) {
            throw new IllegalArgumentException("Yeterli stok yok");
        }
        product.setQuantity(product.getQuantity() - amount);
        Product saved = productRepository.save(product);
        // Satış kaydı oluştur
        StockUser user = userService.getEntity(userId);
        Sale sale = new Sale();
        sale.setProduct(product);
        sale.setUser(user);
        sale.setAmount(amount);
        sale.setSaleTime(java.time.LocalDateTime.now());
        saleRepository.save(sale);
        // Alert güncelle
        alertService.getActiveAlerts(); // Alert'leri senkronize et
        return toResponse(saved);
    }

    // Diğer constructor kaldırıldı, yukarıdaki constructor kullanılacak

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
        StockUser manager = request.managerId() == null ? null : userService.getEntity(request.managerId());
        product.setName(request.name().trim());
        product.setQuantity(request.quantity());
        product.setThreshold(request.threshold());
        product.setPrice(request.price());
        product.setCategory(category);
        product.setManager(manager);
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
            product.getManager() == null ? null : product.getManager().getId(),
            product.getManager() == null ? null : product.getManager().getUsername(),
            lowStock
        );
    }
}
