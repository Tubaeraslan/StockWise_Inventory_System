package com.stockwise.backend.alert;

import java.util.Collection;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    Optional<Alert> findByProductId(Long productId);
    void deleteByProductIdNotIn(Collection<Long> productIds);
}
