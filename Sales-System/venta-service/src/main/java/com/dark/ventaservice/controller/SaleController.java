package com.dark.ventaservice.controller;

import com.dark.ventaservice.model.Sale;
import com.dark.ventaservice.model.SaleItem;
import com.dark.ventaservice.service.SaleService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public Sale createSale(@RequestBody SaleRequest request) {
        return saleService.createSale(request.getSale(), request.getItems());
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @GetMapping("/{saleId}/items")
    public List<SaleItem> getItems(@PathVariable Long saleId) {
        return saleService.getItemsBySale(saleId);
    }

    // ✅ Factura por consola
    @GetMapping("/{saleId}/invoice")
    public ResponseEntity<String> printInvoice(@PathVariable Long saleId) {
        try {
            Sale sale = saleService.getSaleById(saleId);
            if (sale == null) {
                return ResponseEntity.notFound().build();
            }

            List<SaleItem> items = saleService.getItemsBySale(saleId);

            // 📌 Imprimimos en consola
            System.out.println("\n========= FACTURA =========");
            System.out.println("ID Venta: " + sale.getId());
            System.out.println("Fecha: " + sale.getSaleDate());
            System.out.println("Cliente ID: " + sale.getCustomerId());
            System.out.println("Usuario ID: " + sale.getUserId());
            System.out.println("Total: $" + sale.getTotalAmount());
            System.out.println("---------------------------");
            System.out.println("Items:");
            for (SaleItem item : items) {
                double subtotal = item.getPrice() * item.getQuantity();
                System.out.printf("Producto %d | Cantidad: %d | Precio: %.2f | Subtotal: %.2f%n",
                        item.getProductId(), item.getQuantity(), item.getPrice(), subtotal);
            }
            System.out.println("===========================\n");

            // La API devuelve solo un texto simple
            return ResponseEntity.ok("Factura impresa en consola para la venta ID: " + saleId);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error al imprimir la factura: " + e.getMessage());
        }
    }
}

