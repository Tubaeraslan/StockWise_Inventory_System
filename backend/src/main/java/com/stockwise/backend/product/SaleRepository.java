package com.stockwise.backend.product;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    @Query("SELECT s.product.id, SUM(s.amount) FROM Sale s WHERE s.saleTime >= :start AND s.saleTime < :end GROUP BY s.product.id ORDER BY SUM(s.amount) DESC")
    List<Object[]> findProductSalesRanking(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
