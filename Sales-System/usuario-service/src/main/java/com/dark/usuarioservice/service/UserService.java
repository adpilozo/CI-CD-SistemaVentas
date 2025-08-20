package com.dark.usuarioservice.service;

import com.dark.usuarioservice.model.User;
import com.dark.usuarioservice.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        // Usuario quemado para pruebas
        if ("andy".equals(username)) {
            User user = new User();
            user.setUsername("andy");
            // Contraseña "andy123" encriptada com BCrypt
            user.setPassword("$2a$12$Eb8q.0GiskmNysnOnHV11.Uz/NrBB4EHp/tCV2wy2RYtk9OFI8rYO");
            user.setRole("ADMIN");
            return user;
        }
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}