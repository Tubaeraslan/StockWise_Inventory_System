package com.stockwise.backend.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank @Size(max = 120) String name,
    @NotNull @Min(0) Integer quantity,
    @NotNull @Min(0) Integer threshold,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotNull Long categoryId,
    Long managerId,
    @Size(max = 64) String barcode
) {
}
