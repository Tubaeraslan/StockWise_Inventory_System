package com.stockwise.backend.product;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    public static class SellRequest {
        public Long productId;
        public Integer amount;
        public Long userId;
    }

    public static class SellByBarcodeRequest {
        public String barcode;
        public Integer amount;
        public Long userId;
    }

    @PostMapping("/sell")
    public ProductResponse sellProduct(@RequestBody SellRequest request) {
        if (request.productId == null || request.amount == null || request.userId == null) {
            throw new IllegalArgumentException("Ürün, miktar ve kullanıcı zorunlu");
        }
        return productService.sellProduct(request.productId, request.amount, request.userId);
    }

    @PostMapping("/sell-by-barcode")
    public ProductResponse sellByBarcode(@RequestBody SellByBarcodeRequest request) {
        if (request.barcode == null || request.barcode.isBlank() || request.amount == null || request.userId == null) {
            throw new IllegalArgumentException("Barkod, miktar ve kullanıcı zorunlu");
        }
        return productService.sellByBarcode(request.barcode.trim(), request.amount, request.userId);
    }

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAll(@RequestParam(required = false) String name) {
        return productService.getAll(name);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request, @RequestParam Long userId) {
        return productService.create(request, userId);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request, @RequestParam Long userId) {
        return productService.update(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestParam Long userId) {
        productService.delete(id, userId);
    }
}
