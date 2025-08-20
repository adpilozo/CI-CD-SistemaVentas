package com.dark.productoservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_changes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "change_type", nullable = false)
    private String changeType;

    @Column(name = "old_value")
    private BigDecimal oldValue;

    @Column(name = "new_value")
    private BigDecimal newValue;

    @Column(name = "changed_by", nullable = false)
    private Long changedBy;

    @Column(name = "timestamp", columnDefinition = "TIMESTAMP")
    private LocalDateTime timestamp;
}