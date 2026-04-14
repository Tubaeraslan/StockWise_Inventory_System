package com.stockwise.backend.alert.policy;

import com.stockwise.backend.product.Product;

public interface AlertPolicy {
    boolean supports(Product product);
    String buildMessage(Product product);
}
