package com.stockwise.backend.alert;

import java.time.LocalDateTime;

public record AlertResponse(
    Long alertId,
    Long productId,
    String productName,
    Integer quantity,
    Integer threshold,
    Integer shortage,
    String categoryName,
    String message,
    LocalDateTime createdAt
) {
}
