package com.brice.todoapp.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

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
public class RegisterController {

    private static final Logger LOG = LoggerFactory.getLogger(RegisterController.class);
    private final PasswordEncoder passwordEncoder;

    // Regex pattern for validating email format
    private static final Pattern EMAIL_REGEX = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    private final UserRepository userRepository;

    public RegisterController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String email = payload.get("email");

        if (username == null || password == null) {
            LOG.warn("Missing required fields: username or password");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Registration failed: Username and password are required");
            errorResponse.put("code", "MISSING_CREDENTIALS");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Check if username contains spaces
        if (username.contains(" ")) {
            LOG.warn("Username contains spaces: {}", username);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Registration failed: Username cannot contain spaces");
            errorResponse.put("code", "INVALID_USERNAME_FORMAT");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            LOG.warn("Username already exists: {}", username);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Registration failed: Username is already taken");
            errorResponse.put("code", "USERNAME_EXISTS");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Validate email format if provided
        if (email != null && !EMAIL_REGEX.matcher(email).matches()) {
            LOG.warn("Invalid email format: {}", email);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Registration failed: Invalid email format");
            errorResponse.put("code", "INVALID_EMAIL_FORMAT");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Check if email already exists (only if provided)
        if (email != null && userRepository.findByEmail(email).isPresent()) {
            LOG.warn("Email already exists: {}", email);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Registration failed: Email is already registered");
            errorResponse.put("code", "EMAIL_EXISTS");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);
        user.setEmail(email);

        userRepository.save(user);

        LOG.info("User registered: {}", username);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Registration successful");
        response.put("username", username);
        if (email != null) {
            response.put("email", email);
        }
        return ResponseEntity.ok(response);
    }

}