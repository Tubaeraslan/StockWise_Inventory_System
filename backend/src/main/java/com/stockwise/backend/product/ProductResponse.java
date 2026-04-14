package com.stockwise.backend.product;

import java.math.BigDecimal;

public record ProductResponse(
    Long id,
    String name,
    Integer quantity,
    Integer threshold,
    BigDecimal price,
    Long categoryId,
    String categoryName,
    Long managerId,
    String managerUsername,
    boolean lowStock
) {
}
