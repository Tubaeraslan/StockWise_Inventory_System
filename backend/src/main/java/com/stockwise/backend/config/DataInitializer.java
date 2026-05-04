package com.stockwise.backend.config;

import com.stockwise.backend.category.Category;
import com.stockwise.backend.category.CategoryRepository;
import com.stockwise.backend.product.Product;
import com.stockwise.backend.product.ProductRepository;
import com.stockwise.backend.user.StockUser;
import com.stockwise.backend.user.UserRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(
        CategoryRepository categoryRepository,
        ProductRepository productRepository,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.findAll().isEmpty()) {
                StockUser admin = new StockUser();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setPermission("ADMIN");
                userRepository.save(admin);

                StockUser staff = new StockUser();
                staff.setUsername("staff");
                staff.setPassword(passwordEncoder.encode("staff123"));
                staff.setPermission("STAFF");
                userRepository.save(staff);
            }

            if (!categoryRepository.findAll().isEmpty()) {
                return;
            }

            StockUser admin = userRepository.findByUsernameIgnoreCase("admin").orElseThrow();
            StockUser staff = userRepository.findByUsernameIgnoreCase("staff").orElseThrow();

            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Devices and accessories");
            electronics = categoryRepository.save(electronics);

            Category office = new Category();
            office.setName("Office Supplies");
            office.setDescription("Daily office products");
            office = categoryRepository.save(office);

            Product keyboard = new Product();
            keyboard.setName("Wireless Keyboard");
            keyboard.setQuantity(8);
            keyboard.setThreshold(10);
            keyboard.setPrice(new BigDecimal("45.90"));
            keyboard.setCategory(electronics);
            keyboard.setManager(admin);
            productRepository.save(keyboard);

            Product notebook = new Product();
            notebook.setName("A4 Notebook");
            notebook.setQuantity(70);
            notebook.setThreshold(25);
            notebook.setPrice(new BigDecimal("2.40"));
            notebook.setCategory(office);
            notebook.setManager(staff);
            productRepository.save(notebook);
        };
    }
}
