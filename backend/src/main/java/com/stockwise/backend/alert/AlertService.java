package com.stockwise.backend.alert;

import com.stockwise.backend.alert.policy.AlertPolicy;
import com.stockwise.backend.product.Product;
import com.stockwise.backend.product.ProductRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlertService {

    private final ProductRepository productRepository;
    private final AlertRepository alertRepository;
    private final List<AlertPolicy> alertPolicies;

    public AlertService(ProductRepository productRepository, AlertRepository alertRepository, List<AlertPolicy> alertPolicies) {
        this.productRepository = productRepository;
        this.alertRepository = alertRepository;
        this.alertPolicies = alertPolicies;
    }

    @Transactional
    public List<AlertResponse> getActiveAlerts() {
        List<Product> lowStockProducts = productRepository.findAll().stream()
            .filter(this::isLowStock)
            .toList();

        synchronizeAlerts(lowStockProducts);

        return alertRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    private boolean isLowStock(Product product) {
        return product.getQuantity() <= product.getThreshold();
    }

    private void synchronizeAlerts(List<Product> lowStockProducts) {
        if (lowStockProducts.isEmpty()) {
            alertRepository.deleteAll();
            return;
        }

        Set<Long> activeProductIds = lowStockProducts.stream().map(Product::getId).collect(Collectors.toSet());
        alertRepository.deleteByProductIdNotIn(activeProductIds);

        Map<Long, Alert> existingByProductId = alertRepository.findAll().stream()
            .collect(Collectors.toMap(a -> a.getProduct().getId(), Function.identity()));

        List<Alert> alertsToSave = new ArrayList<>();
        for (Product product : lowStockProducts) {
            Alert alert = existingByProductId.getOrDefault(product.getId(), new Alert());
            alert.setProduct(product);
            alert.setMessage(buildMessage(product));
            if (alert.getCreatedAt() == null) {
                alert.setCreatedAt(LocalDateTime.now());
            }
            alertsToSave.add(alert);
        }

        alertRepository.saveAll(alertsToSave);
    }

    private String buildMessage(Product product) {
        return alertPolicies.stream()
            .filter(policy -> policy.supports(product))
            .findFirst()
            .map(policy -> policy.buildMessage(product))
            .orElse("Low stock detected for " + product.getName() + ".");
    }

    private AlertResponse toResponse(Alert alert) {
        Product product = alert.getProduct();
        int shortage = Math.max(0, product.getThreshold() - product.getQuantity());
        return new AlertResponse(
            alert.getId(),
            product.getId(),
            product.getName(),
            product.getQuantity(),
            product.getThreshold(),
            shortage,
            product.getCategory().getName(),
            alert.getMessage(),
            alert.getCreatedAt()
        );
    }
}
