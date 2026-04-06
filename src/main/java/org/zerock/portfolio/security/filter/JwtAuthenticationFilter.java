package org.zerock.portfolio.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.portfolio.security.util.JWTUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (token != null) {
            // [SECURITY] JWT 토큰 길이 검증 (비정상적으로 큰 토큰 차단)
            if (token.length() > 2048) {
                log.warn("Oversized JWT token rejected from IP: {}", request.getRemoteAddr());
                filterChain.doFilter(request, response);
                return;
            }

            Map<String, String> claims = jwtUtil.validateAndExtract(token);
            if (claims != null) {
                String email = claims.get("email");
                String rolesStr = claims.get("roles");

                // [SECURITY] email null 체크
                if (email == null || email.isBlank()) {
                    log.warn("JWT token with empty email from IP: {}", request.getRemoteAddr());
                    filterChain.doFilter(request, response);
                    return;
                }

                List<SimpleGrantedAuthority> authorities = List.of();
                if (rolesStr != null && !rolesStr.isEmpty()) {
                    String cleaned = rolesStr.replaceAll("[\\[\\]\"]", "");
                    authorities = List.of(cleaned.split(",")).stream()
                        .map(String::trim)
                        .filter(r -> !r.isEmpty())
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                        .collect(Collectors.toList());
                }

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // [SECURITY] 유효하지 않은 JWT에 대한 보안 로깅 (MEDIUM-2 수정)
                log.warn("Invalid JWT token from IP: {} for URI: {}",
                        request.getRemoteAddr(), request.getRequestURI());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
