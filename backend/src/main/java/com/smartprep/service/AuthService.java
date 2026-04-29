package com.smartprep.service;

import com.smartprep.dto.AuthRequest;
import com.smartprep.dto.AuthResponse;
import com.smartprep.dto.RegisterRequest;
import com.smartprep.model.User;
import com.smartprep.repository.UserRepository;
import com.smartprep.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String jwtToken = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String jwtToken = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    public AuthResponse googleLogin(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = User.builder()
                            .name(name != null ? name : "Student")
                            .email(email)
                            .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .build();
                    return userRepository.save(newUser);
                });

                String jwtToken = jwtUtil.generateToken(user.getEmail());

                return AuthResponse.builder()
                        .token(jwtToken)
                        .user(user)
                        .build();
            } else {
                throw new IllegalArgumentException("Invalid Google token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token", e);
        }
    }
}
