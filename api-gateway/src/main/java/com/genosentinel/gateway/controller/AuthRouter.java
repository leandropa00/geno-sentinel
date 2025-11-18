package com.genosentinel.gateway.controller;

import com.genosentinel.gateway.dto.LoginRequest;
import com.genosentinel.gateway.dto.LoginResponse;
import com.genosentinel.gateway.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class AuthRouter {

    private final AuthService authService;

    public AuthRouter(AuthService authService) {
        this.authService = authService;
    }

    @Bean
    public RouterFunction<ServerResponse> authRoutes() {
        return route()
                .POST("/api/auth/login", this::login)
                .GET("/api/auth/status", this::authStatus)
                .GET("/api/status", this::status)
                .build();
    }

    private Mono<ServerResponse> login(ServerRequest request) {
        return request.bodyToMono(LoginRequest.class)
                .flatMap(loginRequest -> {
                    try {
                        String token = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
                        LoginResponse response = new LoginResponse(token, "Bearer");
                        return ServerResponse.ok()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(response);
                    } catch (Exception e) {
                        return ServerResponse.badRequest()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(Map.of("error", "Invalid credentials"));
                    }
                });
    }

    private Mono<ServerResponse> authStatus(ServerRequest request) {
        Map<String, String> status = new HashMap<>();
        status.put("status", "active");
        status.put("service", "api-gateway");
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(status);
    }

    private Mono<ServerResponse> status(ServerRequest request) {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "api-gateway");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());
        status.put("version", "1.0.0");
        
        Map<String, String> services = new HashMap<>();
        services.put("clinical-service", "configured");
        services.put("genomic-service", "configured");
        status.put("routed-services", services);
        
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(status);
    }
}

