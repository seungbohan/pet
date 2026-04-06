package org.zerock.portfolio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.request.LoginRequest;
import org.zerock.portfolio.dto.request.SignupRequest;
import org.zerock.portfolio.dto.response.AuthResponse;
import org.zerock.portfolio.dto.response.UserResponse;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.UserRepository;
import org.zerock.portfolio.security.util.JWTUtil;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Log4j2
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        List<String> roles = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(a -> a.replace("ROLE_", ""))
            .collect(Collectors.toList());

        String token = jwtUtil.generateToken(request.getEmail(), roles);

        UserEntity user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserResponse userResponse = UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .profileImageUrl(user.getProfileImageUrl())
            .introduce(user.getIntroduce())
            .fromSocial(user.isFromSocial())
            .roles(roles)
            .build();

        return ResponseEntity.ok(new AuthResponse(token, userResponse));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        UserEntity user = UserEntity.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .fromSocial(false)
            .build();
        user.addUserRole(UserRole.USER);

        userRepository.save(user);

        List<String> roles = List.of("USER");
        String token = jwtUtil.generateToken(user.getEmail(), roles);

        UserResponse userResponse = UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .fromSocial(false)
            .roles(roles)
            .build();

        return ResponseEntity.ok(new AuthResponse(token, userResponse));
    }
}
