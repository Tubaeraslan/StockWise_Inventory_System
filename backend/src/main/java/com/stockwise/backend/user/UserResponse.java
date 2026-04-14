package com.stockwise.backend.user;

public record UserResponse(Long id, String username, UserRole role) {
}
