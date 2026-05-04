package com.stockwise.backend.analysis;

import com.stockwise.backend.category.CategoryRepository;
import com.stockwise.backend.product.Product;
import com.stockwise.backend.product.ProductRepository;
import com.stockwise.backend.product.SaleRepository;
import com.stockwise.backend.product.ProductRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalysisService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SaleRepository saleRepository;

    public AnalysisService(ProductRepository productRepository, CategoryRepository categoryRepository, SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.saleRepository = saleRepository;
    }
    @Transactional(readOnly = true)
    public List<com.stockwise.backend.analysis.SalesRankingResponse> getSalesRanking(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.plusMonths(1).atDay(1).atStartOfDay();
        List<Object[]> results = saleRepository.findProductSalesRanking(start, end);
        return results.stream().map(obj -> {
            Long productId = (Long) obj[0];
            Long totalSoldLong = (Long) obj[1];
            int totalSold = totalSoldLong != null ? totalSoldLong.intValue() : 0;
            String productName = productRepository.findById(productId).map(Product::getName).orElse("?");
            return new com.stockwise.backend.analysis.SalesRankingResponse(productId, productName, totalSold);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnalysisResponse getOverview() {
        var products = productRepository.findAll();
        long lowStockCount = products.stream()
            .filter(p -> p.getQuantity() <= p.getThreshold())
            .count();

        BigDecimal totalInventoryValue = products.stream()
            .map(this::lineValue)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AnalysisResponse(
            products.size(),
            categoryRepository.count(),
            lowStockCount,
            totalInventoryValue
        );
    }

    private BigDecimal lineValue(Product product) {
        return product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()));
    }
}
