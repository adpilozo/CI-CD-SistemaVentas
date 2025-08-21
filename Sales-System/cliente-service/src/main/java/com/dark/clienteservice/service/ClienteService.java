package com.dark.clienteservice.service;

import com.dark.clienteservice.model.Cliente;
import com.dark.clienteservice.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository repo;

    public ClienteService(ClienteRepository repo) {
        this.repo = repo;
    }

    // === NUEVO: buscar por identificación (phone) ===
    public Cliente findByIdentificacion(String identificacion) {
        return repo.findByPhone(identificacion).orElse(null);
        // Si quieres fallback por email:
        // return repo.findByPhone(identificacion).orElseGet(
        //        () -> repo.findByEmail(identificacion).orElse(null));
    }

    public Cliente create(Cliente cliente) {
        return repo.save(cliente);
    }

    public List<Cliente> findAll() {
        return repo.findAll();
    }

    public Optional<Cliente> findById(Long id) {
        return repo.findById(id);
    }

    public Cliente update(Long id, Cliente cliente) {
        return repo.findById(id).map(c -> {
            c.setName(cliente.getName());
            c.setEmail(cliente.getEmail());
            c.setPhone(cliente.getPhone());
            c.setAddress(cliente.getAddress());
            return repo.save(c);
        }).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
