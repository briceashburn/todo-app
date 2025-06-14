package com.brice.todoapp.controllers;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.brice.todoapp.dto.RegistrationRequest;
import com.brice.todoapp.models.User;
import com.brice.todoapp.repositories.UserRepository;

import jakarta.validation.Valid;

@RestController
@Validated
public class RegisterController {

    private static final Logger LOG = LoggerFactory.getLogger(RegisterController.class);
    private static final String STATUS_KEY = "status";
    private static final String MESSAGE_KEY = "message";
    private static final String CODE_KEY = "code";
    private static final String USERNAME_KEY = "username";
    private static final String EMAIL_KEY = "email";
    private static final String STATUS_ERROR = "error";
    private static final String STATUS_SUCCESS = "success";

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public RegisterController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/api/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegistrationRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            LOG.warn("Username already exists: {}", request.getUsername());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put(STATUS_KEY, STATUS_ERROR);
            errorResponse.put(MESSAGE_KEY, "Registration failed: Username is already taken");
            errorResponse.put(CODE_KEY, 400);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Check if email already exists (only if provided)
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()) {
            LOG.warn("Email already exists: {}", request.getEmail());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put(STATUS_KEY, STATUS_ERROR);
            errorResponse.put(MESSAGE_KEY, "Registration failed: Email is already registered");
            errorResponse.put(CODE_KEY, 400);
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(hashedPassword);
        user.setEmail(request.getEmail());

        userRepository.save(user);

        LOG.info("User registered: {}", request.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put(STATUS_KEY, STATUS_SUCCESS);
        response.put(MESSAGE_KEY, "Registration successful");
        response.put(USERNAME_KEY, request.getUsername());
        response.put(CODE_KEY, 200);
        if (request.getEmail() != null) {
            response.put(EMAIL_KEY, request.getEmail());
        }
        return ResponseEntity.ok(response);
    }
}