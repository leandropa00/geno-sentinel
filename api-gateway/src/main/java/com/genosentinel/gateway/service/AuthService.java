package com.genosentinel.gateway.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final JwtService jwtService;
    
    // In-memory user store (in production, use a database)
    private final Map<String, String> users = new HashMap<>();

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
        // Initialize with default users
        initializeDefaultUsers();
    }

    private void initializeDefaultUsers() {
        // Default users (in production, these should be in a database)
        users.put("admin", "admin123");
        users.put("user", "user123");
        users.put("clinician", "clinician123");
    }

    public String authenticate(String username, String password) {
        String storedPassword = users.get(username);
        
        if (storedPassword == null || !storedPassword.equals(password)) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return jwtService.generateToken(username);
    }
}

