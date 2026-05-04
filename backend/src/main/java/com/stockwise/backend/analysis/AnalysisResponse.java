package com.stockwise.backend.analysis;

import java.math.BigDecimal;

public record AnalysisResponse(
    long totalProducts,
    long totalCategories,
    long lowStockProducts,
    BigDecimal totalInventoryValue
) {
}
