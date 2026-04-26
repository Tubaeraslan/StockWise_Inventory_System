package com.stockwise.backend.product;

import com.stockwise.backend.user.StockUser;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private StockUser user;

    @Column(nullable = false)
    private Integer amount;

    @Column(name = "sale_time", nullable = false)
    private LocalDateTime saleTime;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public StockUser getUser() { return user; }
    public void setUser(StockUser user) { this.user = user; }
    public Integer getAmount() { return amount; }
    public void setAmount(Integer amount) { this.amount = amount; }
    public LocalDateTime getSaleTime() { return saleTime; }
    public void setSaleTime(LocalDateTime saleTime) { this.saleTime = saleTime; }
}
