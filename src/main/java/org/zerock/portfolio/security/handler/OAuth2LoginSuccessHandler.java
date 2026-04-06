package org.zerock.portfolio.security.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.zerock.portfolio.dto.AuthUserDTO;
import org.zerock.portfolio.security.util.JWTUtil;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Log4j2
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        AuthUserDTO authUser = (AuthUserDTO) authentication.getPrincipal();
        String email = authUser.getEmail();

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(a -> a.replace("ROLE_", ""))
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(email, roles);
        // [SECURITY] URL fragment (#)에 토큰 전달 - 서버 로그에 남지 않음 (HIGH-2 수정)
        // fragment는 브라우저에서만 접근 가능하며 HTTP 요청에 포함되지 않음
        response.sendRedirect(frontendUrl + "/oauth2/callback#token=" + token);
    }
}
