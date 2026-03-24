package com.stockwise.backend.alert;

import com.stockwise.backend.product.Product;
import com.stockwise.backend.product.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlertService {

    private final ProductRepository productRepository;

    public AlertService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getActiveAlerts() {
        return productRepository.findAll().stream()
            .filter(this::isLowStock)
            .map(this::toResponse)
            .toList();
    }

    private boolean isLowStock(Product product) {
        return product.getQuantity() <= product.getThreshold();
    }

    private AlertResponse toResponse(Product product) {
        int shortage = Math.max(0, product.getThreshold() - product.getQuantity());
        return new AlertResponse(
            product.getId(),
            product.getName(),
            product.getQuantity(),
            product.getThreshold(),
            shortage,
            product.getCategory().getName()
        );
    }
}
