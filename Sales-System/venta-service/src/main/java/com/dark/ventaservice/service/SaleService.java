package com.dark.ventaservice.service;

import com.dark.ventaservice.model.Invoice;
import com.dark.ventaservice.model.Sale;
import com.dark.ventaservice.model.SaleItem;
import com.dark.ventaservice.repository.InvoiceRepository;
import com.dark.ventaservice.repository.SaleItemRepository;
import com.dark.ventaservice.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository itemRepository;
    private final InvoiceRepository invoiceRepository;

    public SaleService(SaleRepository saleRepository,
                       SaleItemRepository itemRepository,
                       InvoiceRepository invoiceRepository) {
        this.saleRepository = saleRepository;
        this.itemRepository = itemRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public Sale createSale(Sale sale, List<SaleItem> items) {
        double total = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
        sale.setTotalAmount(total);
        sale.setSaleDate(LocalDateTime.now().toString());

        Sale savedSale = saleRepository.save(sale);

        for (SaleItem item : items) {
            item.setSaleId(savedSale.getId());
            itemRepository.save(item);
        }

        // Simulación de generación de PDF
        Invoice invoice = new Invoice();
        invoice.setSaleId(savedSale.getId());
        invoice.setInvoicePdf("factura_" + savedSale.getId() + ".pdf"); // simulación
        invoice.setCreatedAt(LocalDateTime.now().toString());
        invoiceRepository.save(invoice);

        return savedSale;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public List<SaleItem> getItemsBySale(Long saleId) {
        return itemRepository.findBySaleId(saleId);
    }
}
