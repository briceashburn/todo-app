package com.brice.todoapp.controllers;

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
    public ResponseEntity<String> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String email = payload.get("email");

        if (username == null || password == null) {
            LOG.warn("Missing required fields: username or password");
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        // Check if username contains spaces
        if (username.contains(" ")) {
            LOG.warn("Username contains spaces: {}", username);
            return ResponseEntity.badRequest().body("Username cannot contain spaces");
        }

        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            LOG.warn("Username already exists: {}", username);
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Validate email format if provided
        if (email != null && !EMAIL_REGEX.matcher(email).matches()) {
            LOG.warn("Invalid email format: {}", email);
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        // Check if email already exists (only if provided)
        if (email != null && userRepository.findByEmail(email).isPresent()) {
            LOG.warn("Email already exists: {}", email);
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword); // Save the hashed password
        user.setEmail(email); // Email can be null

        userRepository.save(user);

        LOG.info("User registered: {}", username);
        return ResponseEntity.ok("User registered: " + username);
    }

}