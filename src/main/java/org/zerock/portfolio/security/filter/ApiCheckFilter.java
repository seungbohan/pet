package org.zerock.portfolio.security.filter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.portfolio.security.util.JWTUtil;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
public class ApiCheckFilter extends OncePerRequestFilter {

    private AntPathMatcher antPathMatcher;
    private List<String> patterns;
    private JWTUtil jwtUtil;

    public ApiCheckFilter(List<String> patterns, JWTUtil jwtUtil) {
        this.antPathMatcher = new AntPathMatcher();
        this.patterns = patterns;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {

        log.info("REQUESTRUI: " + request.getRequestURI());

        boolean match = patterns.stream().anyMatch(p -> antPathMatcher.match(p, request.getRequestURI()));
        boolean reviewMatch = antPathMatcher.match("/api/review/**", request.getRequestURI())
                && request.getMethod().equals("POST") || request.getMethod().equals("PUT") || request.getMethod().equals("DELETE");

        log.info("match: " + match);
        log.info("request.getMethod(): " + request.getMethod());
        log.info("request.getRequestURI(): " + request.getRequestURI());
        log.info("reviewMatch: " + reviewMatch);

        if (request.getMethod().equals("GET") && antPathMatcher.match("/api/review/**", request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (match || reviewMatch) {
            log.info("ApiCheckFilter");

            boolean checkHeader = checkAuthHeader(request);
            log.info("checkHeader: " + checkHeader);
            if (checkHeader) {
                filterChain.doFilter(request, response);
                return;
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=utf-8");
                JSONObject json = new JSONObject();
                String message = "FAIL CHECK API TOKEN";
                json.put("code", "403");
                json.put("message", message);

                PrintWriter out = response.getWriter();
                out.print(json);
                return;
            }

        }

        filterChain.doFilter(request, response);
    }

    private boolean checkAuthHeader(HttpServletRequest request) {

        boolean checkResult = false;
        log.info(request );
        String authHeader = request.getHeader("Authorization");
        log.info("authHeader: " + authHeader);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            log.info("Authorization exist: " + authHeader);

            try {
                Map<String ,String > result = jwtUtil.validateAndExtract(authHeader.substring(7));
                String email = result.get("email");
                String rolesJson = result.get("roles");

                ObjectMapper objectMapper = new ObjectMapper();
                List<String> rolesList = objectMapper.readValue(rolesJson, new TypeReference<List<String>>() {});

                log.info("email: " + email);
                log.info("role: " + rolesList);

                if (email != null || rolesList != null) {

                    List<GrantedAuthority> authorities = rolesList.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList());

                    // 2. 인증 객체 생성
                    Authentication authToken =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);

                    // 3. ContextHolder에 인증 정보 주입 → ★ 여기 넣어야 함!
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    log.info("✅ 인증 객체 주입 완료: " + email + ", 권한: " + rolesList);
                }

                checkResult = email.length() > 0;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        log.info("checkResult: " + checkResult);
        return checkResult;
    }
}
