package com.dark.ventaservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sale_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "sale_id")
    private Long saleId;

    private int quantity;
    private double price;
}
