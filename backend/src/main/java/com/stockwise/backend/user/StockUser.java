package com.stockwise.backend.user;

import com.stockwise.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
// ...existing imports...
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class StockUser extends BaseEntity {

    @Column(nullable = false, unique = true, length = 80)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String permission;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}
