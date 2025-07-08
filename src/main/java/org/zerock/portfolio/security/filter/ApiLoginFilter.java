package org.zerock.portfolio.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.zerock.portfolio.security.dto.LoginRequestDTO;
import org.zerock.portfolio.security.dto.UserAuthDTO;
import org.zerock.portfolio.security.util.JWTUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
public class ApiLoginFilter extends AbstractAuthenticationProcessingFilter {

    private JWTUtil jwtUtil;

    public ApiLoginFilter(String defaultFilterProcessingUrl, JWTUtil jwtUtil) {
        super(defaultFilterProcessingUrl);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
        throws AuthenticationException, IOException, ServletException {
        log.info("-------ApiLoginFilter--------");
        log.info("attemptAuthentication");

        ObjectMapper objectMapper = new ObjectMapper();

        LoginRequestDTO dto = objectMapper.readValue(request.getInputStream(), LoginRequestDTO.class);

        String email = dto.getEmail();
        String pw = dto.getPassword();

        if (email == null) {
            throw new BadCredentialsException("email cannot be null");
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, pw);

        return getAuthenticationManager().authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException{

        log.info("----------------ApiLoginFilter------------------");
        log.info("successfulAuthentication: " + authResult);

        String email = ((UserAuthDTO)authResult.getPrincipal()).getUsername();
        List<String> roles = authResult.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", "")).toList();

        log.info("email: " + email);
        log.info("role: " + roles);

        String token = null;

        try {
            token = jwtUtil.generateToken(email, roles);

            response.setContentType("application/json;charset=utf-8");

            Map<String, String> result = new HashMap<>();
            result.put("token", token);

            String json = new ObjectMapper().writeValueAsString(result);
            response.getWriter().write(json);

            log.info("token: " + token);
        } catch (Exception e) {
            e.printStackTrace();
        }

        log.info(authResult.getPrincipal());
    }
}
