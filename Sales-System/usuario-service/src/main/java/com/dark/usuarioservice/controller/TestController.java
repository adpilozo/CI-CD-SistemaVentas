package com.dark.usuarioservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class TestController {

    @GetMapping("/test")
    public String testEndpoint() {
        return "✅ Acceso autorizado con JWT!";
    }
}