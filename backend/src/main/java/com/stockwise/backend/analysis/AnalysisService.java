package com.stockwise.backend.analysis;

import com.stockwise.backend.category.CategoryRepository;
import com.stockwise.backend.product.Product;
import com.stockwise.backend.product.ProductRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalysisService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AnalysisService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public AnalysisResponse getOverview() {
        var products = productRepository.findAll();
        long lowStockCount = products.stream()
            .filter(p -> p.getQuantity() <= p.getThreshold())
            .count();

        BigDecimal totalInventoryValue = products.stream()
            .map(this::lineValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AnalysisResponse(
            products.size(),
            categoryRepository.count(),
            lowStockCount,
            totalInventoryValue
        );
    }

    private BigDecimal lineValue(Product product) {
        return product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()));
    }
}
