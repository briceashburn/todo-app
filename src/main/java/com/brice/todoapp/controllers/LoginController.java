package com.brice.todoapp.controllers;

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

@RestController
public class LoginController {
    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/api/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null) {
            LOG.warn("Missing required fields: username or password");
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            LOG.info("User logged in: {}", username);
            return ResponseEntity.ok("Login successful");
        } else {
            LOG.warn("Invalid login attempt for username: {}", username);
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}