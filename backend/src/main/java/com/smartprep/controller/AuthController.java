package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.dto.AuthRequest;
import com.smartprep.dto.AuthResponse;
import com.smartprep.dto.RegisterRequest;
import com.smartprep.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User logged in successfully", authService.login(request)));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.success("User logged in with Google successfully", authService.googleLogin(request.get("token"))));
    }
}
