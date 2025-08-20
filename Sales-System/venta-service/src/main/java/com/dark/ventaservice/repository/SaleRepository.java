package com.dark.ventaservice.repository;

import com.dark.ventaservice.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}