package com.stockwise.backend.alert;

public record AlertResponse(
    Long productId,
    String productName,
    Integer quantity,
    Integer threshold,
    Integer shortage,
    String categoryName
) {
}
