package com.dark.usuarioservice.controller;

import com.dark.usuarioservice.dto.LoginRequest;
import com.dark.usuarioservice.dto.LoginResponse;
import com.dark.usuarioservice.model.User;
import com.dark.usuarioservice.security.JwtUtil;
import com.dark.usuarioservice.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.save(user);
        return "Usuario registrado correctamente.";
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userService.findByUsername(request.getUsername());
        if (user != null && userService.validatePassword(request.getPassword(), user.getPassword())) {
            // Incluir el rol en el token
            String token = jwtUtil.generateToken(user.getUsername(), List.of(user.getRole()));
            return new LoginResponse(token);
        }
        throw new RuntimeException("Credenciales inválidas");
    }
}