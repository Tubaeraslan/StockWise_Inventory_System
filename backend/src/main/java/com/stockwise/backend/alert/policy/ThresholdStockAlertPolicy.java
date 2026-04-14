package com.stockwise.backend.alert.policy;

import com.stockwise.backend.product.Product;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class ThresholdStockAlertPolicy implements AlertPolicy {

    @Override
    public boolean supports(Product product) {
        return product.getQuantity().equals(product.getThreshold());
    }

    @Override
    public String buildMessage(Product product) {
        return "Stock reached threshold for " + product.getName() + ".";
    }
}
