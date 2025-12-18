package org.zerock.portfolio.security.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.portfolio.dto.AuthUserDTO;
import org.zerock.portfolio.security.util.JWTUtil;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        log.info("OAuth2 Login Success Handler called");

        AuthUserDTO authUser = (AuthUserDTO) authentication.getPrincipal();

        String email = authUser.getEmail();
        List<String> roles = authUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .collect(Collectors.toList());

        log.info("OAuth2 User email: " + email);
        log.info("OAuth2 User roles: " + roles);

        try {
            String token = jwtUtil.generateToken(email, roles);
            log.info("Generated JWT token for OAuth2 user");

            String redirectUrl = "/oauth2/success?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            log.error("JWT generation failed", e);
            response.sendRedirect("/join/login?error=token_generation_failed");
        }
    }
}