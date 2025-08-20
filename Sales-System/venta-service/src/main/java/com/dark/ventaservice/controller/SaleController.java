package com.dark.ventaservice.controller;

import com.dark.ventaservice.model.Sale;
import com.dark.ventaservice.model.SaleItem;
import com.dark.ventaservice.service.SaleService;
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
}