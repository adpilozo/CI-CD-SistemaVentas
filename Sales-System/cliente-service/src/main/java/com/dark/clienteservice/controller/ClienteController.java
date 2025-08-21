package com.dark.clienteservice.controller;

import com.dark.clienteservice.model.Cliente;
import com.dark.clienteservice.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    // === NUEVO: búsqueda pública por identificación (ej: phone) ===
    @GetMapping("/identification/{identificacion}")
    public ResponseEntity<Cliente> buscarPorIdentificacion(@PathVariable String identificacion) {
        Cliente c = service.findByIdentificacion(identificacion);
        return (c != null) ? ResponseEntity.ok(c) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Cliente create(@RequestBody Cliente cliente) {
        return service.create(cliente);
    }

    @GetMapping
    public List<Cliente> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Cliente getOne(@PathVariable Long id) {
        return service.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Cliente update(@PathVariable Long id, @RequestBody Cliente cliente) {
        return service.update(id, cliente);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
