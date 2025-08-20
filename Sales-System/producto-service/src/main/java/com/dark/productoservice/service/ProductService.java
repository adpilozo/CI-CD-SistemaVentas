package com.dark.productoservice.service;

import com.dark.productoservice.model.Product;
import com.dark.productoservice.model.ProductChange;
import com.dark.productoservice.repository.ProductRepository;
import com.dark.productoservice.repository.ProductChangeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductChangeRepository changeRepository;

    public ProductService(ProductRepository productRepository, ProductChangeRepository changeRepository) {
        this.productRepository = productRepository;
        this.changeRepository = changeRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product, Long userId) {
        product.setCreatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);

        ProductChange change = new ProductChange(
                null,
                saved.getId(),
                "created",
                null,
                saved.getPrice(),
                userId,
                LocalDateTime.now()
        );
        changeRepository.save(change);

        return saved;
    }

    public Product update(Long id, Product product, Long userId) {
        Product existing = productRepository.findById(id).orElseThrow();

        // Comparar y registrar cambio de precio
        if (existing.getPrice() != null && product.getPrice() != null &&
                existing.getPrice().compareTo(product.getPrice()) != 0) {
            ProductChange priceChange = new ProductChange(
                    null,
                    id,
                    "price_edited",
                    existing.getPrice(),
                    product.getPrice(),
                    userId,
                    LocalDateTime.now()
            );
            changeRepository.save(priceChange);
        }

        // Comparar y registrar cambio de stock
        if (existing.getStock() != null && product.getStock() != null &&
                !existing.getStock().equals(product.getStock())) {
            ProductChange stockChange = new ProductChange(
                    null,
                    id,
                    "stock_modificated",
                    BigDecimal.valueOf(existing.getStock()),
                    BigDecimal.valueOf(product.getStock()),
                    userId,
                    LocalDateTime.now()
            );
            changeRepository.save(stockChange);
        }

        // Mantener la fecha original de creación
        product.setId(id);
        product.setCreatedAt(existing.getCreatedAt());

        return productRepository.save(product);
    }

    public void delete(Long id, Long userId) {
        Product existing = productRepository.findById(id).orElseThrow();

        ProductChange change = new ProductChange(
                null,
                id,
                "deleted",
                existing.getPrice(),
                null,
                userId,
                LocalDateTime.now()
        );
        changeRepository.save(change);
        productRepository.deleteById(id);
    }
}
