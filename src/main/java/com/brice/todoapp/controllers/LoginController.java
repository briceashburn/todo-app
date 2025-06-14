package com.brice.todoapp.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.brice.todoapp.dto.LoginRequest;
import com.brice.todoapp.models.User;
import com.brice.todoapp.repositories.UserRepository;
import com.brice.todoapp.security.JwtService;

import jakarta.validation.Valid;

@RestController
@Validated
public class LoginController {
    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
    private static final String STATUS_KEY = "status";
    private static final String MESSAGE_KEY = "message";
    private static final String CODE_KEY = "code";
    private static final String TOKEN_KEY = "token";
    private static final String USERNAME_KEY = "username";
    private static final String STATUS_ERROR = "error";
    private static final String STATUS_SUCCESS = "success";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/api/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            LOG.info("User logged in: {}", request.getUsername());
            String token = jwtService.generateToken(request.getUsername());
            Map<String, Object> response = new HashMap<>();
            response.put(STATUS_KEY, STATUS_SUCCESS);
            response.put(MESSAGE_KEY, "Authentication successful");
            response.put(TOKEN_KEY, token);
            response.put(USERNAME_KEY, request.getUsername());
            response.put(CODE_KEY, 200);
            return ResponseEntity.ok(response);
        } else {
            LOG.warn("Invalid login attempt for username: {}", request.getUsername());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put(STATUS_KEY, STATUS_ERROR);
            errorResponse.put(MESSAGE_KEY, "Authentication failed: Invalid username or password");
            errorResponse.put(CODE_KEY, 401);
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}