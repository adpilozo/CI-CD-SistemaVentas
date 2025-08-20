package com.dark.productoservice.repository;

import com.dark.productoservice.model.ProductChange;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductChangeRepository extends JpaRepository<ProductChange, Long> {
}