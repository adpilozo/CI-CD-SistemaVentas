package com.dark.clienteservice.service;

import com.dark.clienteservice.model.Cliente;
import com.dark.clienteservice.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public Cliente create(Cliente cliente) {
        return repository.save(cliente);
    }

    public List<Cliente> findAll() {
        return repository.findAll();
    }

    public Optional<Cliente> findById(Long id) {
        return repository.findById(id);
    }

    public Cliente update(Long id, Cliente cliente) {
        cliente.setId(id);
        return repository.save(cliente);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}