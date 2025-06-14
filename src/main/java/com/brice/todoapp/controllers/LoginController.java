package com.brice.todoapp.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.brice.todoapp.models.User;
import com.brice.todoapp.repositories.UserRepository;
import com.brice.todoapp.security.JwtService;

@RestController
public class LoginController {
    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null) {
            LOG.warn("Missing required fields: username or password");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Authentication failed: Username and password are required");
            errorResponse.put("code", "MISSING_CREDENTIALS");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            LOG.info("User logged in: {}", username);
            String token = jwtService.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Authentication successful");
            response.put("token", token);
            response.put("username", username);
            return ResponseEntity.ok(response);
        } else {
            LOG.warn("Invalid login attempt for username: {}", username);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Authentication failed: Invalid username or password");
            errorResponse.put("code", "INVALID_CREDENTIALS");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}