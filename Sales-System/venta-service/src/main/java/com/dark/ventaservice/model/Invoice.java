package com.dark.ventaservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sale_id")
    private Long saleId;

    @Column(name = "invoice_pdf")
    private String invoicePdf;

    @Column(name = "created_at")
    private String createdAt;
}
