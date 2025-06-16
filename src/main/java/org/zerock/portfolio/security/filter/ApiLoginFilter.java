package org.zerock.portfolio.security.filter;

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
import org.zerock.portfolio.security.dto.UserAuthDTO;
import org.zerock.portfolio.security.util.JWTUtil;

import java.io.IOException;

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

        String email = request.getParameter("email");
        String pw = "1111";

        if (email == null) {
            throw new BadCredentialsException("email cannot ne null");
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

        String token = null;

        try {
            token = jwtUtil.generateToken(email);

            response.setContentType("text/plain");
            response.getOutputStream().write(token.getBytes());

            log.info("token: " + token);
        } catch (Exception e) {
            e.printStackTrace();
        }

        log.info(authResult.getPrincipal());
    }
}
