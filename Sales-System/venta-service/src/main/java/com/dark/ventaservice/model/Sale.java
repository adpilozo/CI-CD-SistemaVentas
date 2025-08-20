package com.dark.ventaservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sale_date")
    private String saleDate;

    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "customer_id")
    private Long customerId;
}
