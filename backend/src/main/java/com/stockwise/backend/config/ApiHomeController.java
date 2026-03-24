package com.stockwise.backend.config;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiHomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "message", "StockWise Backend is running",
            "quickTest", Map.of(
                "categories", "/api/categories",
                "products", "/api/products",
                "alerts", "/api/alerts/active",
                "h2Console", "/h2-console"
            ),
            "auth", "Use HTTP Basic: admin/admin123 or staff/staff123"
        );
    }
}
