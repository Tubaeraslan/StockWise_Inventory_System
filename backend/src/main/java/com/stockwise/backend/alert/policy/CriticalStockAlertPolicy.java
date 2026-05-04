package com.stockwise.backend.alert.policy;

import com.stockwise.backend.product.Product;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class CriticalStockAlertPolicy implements AlertPolicy {

    @Override
    public boolean supports(Product product) {
        return product.getQuantity() < product.getThreshold();
    }

    @Override
    public String buildMessage(Product product) {
        int shortage = Math.max(0, product.getThreshold() - product.getQuantity());
        return "Critical stock for " + product.getName() + ": shortage " + shortage + " units.";
    }
}
