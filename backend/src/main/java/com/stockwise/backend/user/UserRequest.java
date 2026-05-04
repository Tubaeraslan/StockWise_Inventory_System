package com.stockwise.backend.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank @Size(max = 80) String username,
    @NotBlank @Size(min = 6, max = 120) String password,
    @NotBlank @Size(max = 50) String permission
) {
}
