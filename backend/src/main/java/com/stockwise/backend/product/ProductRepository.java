package com.stockwise.backend.product;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByQuantityLessThanEqual(Integer threshold);
    Optional<Product> findByBarcode(String barcode);
}
