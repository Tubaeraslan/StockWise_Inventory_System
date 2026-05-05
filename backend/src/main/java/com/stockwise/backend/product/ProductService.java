package com.stockwise.backend.product;

import com.stockwise.backend.category.Category;
import com.stockwise.backend.category.CategoryService;
import com.stockwise.backend.common.ResourceNotFoundException;
import com.stockwise.backend.user.StockUser;
import com.stockwise.backend.user.UserService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final com.stockwise.backend.alert.AlertService alertService;
    private final com.stockwise.backend.alert.AlertRepository alertRepository;
    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final SaleRepository saleRepository;
    private final com.stockwise.backend.user.UserActivityLogService userActivityLogService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService, UserService userService, com.stockwise.backend.alert.AlertService alertService, com.stockwise.backend.alert.AlertRepository alertRepository, SaleRepository saleRepository, com.stockwise.backend.user.UserActivityLogService userActivityLogService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        this.alertService = alertService;
        this.alertRepository = alertRepository;
        this.saleRepository = saleRepository;
        this.userActivityLogService = userActivityLogService;
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

    @Transactional
    public ProductResponse sellByBarcode(String barcode, int amount, Long userId) {
        if (amount <= 0) throw new IllegalArgumentException("Satış miktarı pozitif olmalı");
        Product product = productRepository.findByBarcode(barcode)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));
        if (product.getQuantity() < amount) {
            throw new IllegalArgumentException("Yeterli stok yok");
        }
        product.setQuantity(product.getQuantity() - amount);
        Product saved = productRepository.save(product);
        StockUser user = userService.getEntity(userId);
        Sale sale = new Sale();
        sale.setProduct(product);
        sale.setUser(user);
        sale.setAmount(amount);
        sale.setSaleTime(java.time.LocalDateTime.now());
        saleRepository.save(sale);
        alertService.getActiveAlerts();
        return toResponse(saved);
    }

    @Transactional
    public ProductResponse addStock(Long productId, int amount, Long userId) {
        if (amount <= 0) throw new IllegalArgumentException("Eklenen stok miktarı pozitif olmalı");

        StockUser user = userService.getEntity(userId);
        if (user.getPermission() == null || !"ADMIN".equalsIgnoreCase(user.getPermission())) {
            throw new IllegalArgumentException("Bu işlem için yalnızca admin yetkisi gerekli");
        }

        Product product = getEntity(productId);
        product.setQuantity(product.getQuantity() + amount);
        Product saved = productRepository.save(product);
        userActivityLogService.log(userId, "PRODUCT_STOCK_ADD: " + saved.getName() + " +" + amount);
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
    public ProductResponse create(ProductRequest request, Long userId) {
        Product product = new Product();
        applyRequest(product, request);
        if (product.getBarcode() == null || product.getBarcode().isBlank()) {
            product.setBarcode(generateUniqueBarcode());
        }
        Product saved = productRepository.save(product);
        userActivityLogService.log(userId, "PRODUCT_CREATE: " + saved.getName());
        return toResponse(saved);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request, Long userId) {
        Product product = getEntity(id);
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        userActivityLogService.log(userId, "PRODUCT_UPDATE: " + saved.getName());
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Product product = getEntity(id);
        alertRepository.findByProductId(id).ifPresent(alertRepository::delete);
        productRepository.delete(product);
        userActivityLogService.log(userId, "PRODUCT_DELETE: " + product.getName());
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
        // Only set barcode when explicitly provided. For create, service will generate when missing.
        if (request.barcode() != null && !request.barcode().isBlank()) {
            String b = request.barcode().trim();
            Optional<Product> existing = productRepository.findByBarcode(b);
            if (existing.isPresent() && (product.getId() == null || !existing.get().getId().equals(product.getId()))) {
                throw new IllegalArgumentException("Barkod zaten kullanılıyor: " + b);
            }
            product.setBarcode(b);
        }
        product.setCategory(category);
        product.setManager(manager);
    }

    private String generateUniqueBarcode() {
        String code;
        do {
            code = "BC" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        } while (productRepository.findByBarcode(code).isPresent());
        return code;
    }

    private ProductResponse toResponse(Product product) {
        boolean lowStock = product.getQuantity() <= product.getThreshold();
        return new ProductResponse(
            product.getId(),
            product.getBarcode(),
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
