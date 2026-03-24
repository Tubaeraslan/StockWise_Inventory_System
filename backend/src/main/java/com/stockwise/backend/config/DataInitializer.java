package com.stockwise.backend.config;

import com.stockwise.backend.category.Category;
import com.stockwise.backend.category.CategoryRepository;
import com.stockwise.backend.product.Product;
import com.stockwise.backend.product.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {
            if (!categoryRepository.findAll().isEmpty()) {
                return;
            }

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
            productRepository.save(keyboard);

            Product notebook = new Product();
            notebook.setName("A4 Notebook");
            notebook.setQuantity(70);
            notebook.setThreshold(25);
            notebook.setPrice(new BigDecimal("2.40"));
            notebook.setCategory(office);
            productRepository.save(notebook);
        };
    }
}
