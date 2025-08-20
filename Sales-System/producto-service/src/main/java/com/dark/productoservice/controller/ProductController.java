package com.dark.productoservice.controller;

import com.dark.productoservice.model.Product;
import com.dark.productoservice.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> all() {
        return productService.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product product,
                          @RequestHeader("userId") Long userId) {
        return productService.save(product, userId);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id,
                          @RequestBody Product product,
                          @RequestHeader("userId") Long userId) {
        return productService.update(id, product, userId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       @RequestHeader("userId") Long userId) {
        productService.delete(id, userId);
    }
}