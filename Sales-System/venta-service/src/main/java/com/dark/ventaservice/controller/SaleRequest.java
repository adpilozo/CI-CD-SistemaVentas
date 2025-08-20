package com.dark.ventaservice.controller;

import com.dark.ventaservice.model.Sale;
import com.dark.ventaservice.model.SaleItem;
import lombok.Data;

import java.util.List;

@Data
public class SaleRequest {
    private Sale sale;
    private List<SaleItem> items;
}