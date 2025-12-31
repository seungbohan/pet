package org.zerock.portfolio.security.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.DefaultClaims;
import io.jsonwebtoken.impl.DefaultJws;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
public class JWTUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expireSeconds;

    public String generateToken(String content, List<String> roles) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        String rolesJson = objectMapper.writeValueAsString(roles);

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(Date.from(ZonedDateTime.now().plusSeconds(expireSeconds).toInstant()))
                .claim("sub", content)
                .claim("roles", rolesJson)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes("UTF-8"))
                .compact();
    }

    public Map<String ,String > validateAndExtract(String tokenStr) throws Exception {

        Map<String ,String > contentValue = new HashMap<>();

        try {
            DefaultJws defaultJws = (DefaultJws) Jwts.parser().setSigningKey(secretKey.getBytes("UTF-8"))
                    .parseClaimsJws(tokenStr);

            log.info(defaultJws);
            log.info(defaultJws.getBody().getClass());

            DefaultClaims claims = (DefaultClaims) defaultJws.getBody();

            log.info("--------------------------");

            String email = claims.get("sub", String.class);
            String rolesJson = claims.get("roles", String.class);

            contentValue.put("email", email);
            contentValue.put("roles", rolesJson);
            log.info("email: " + email);
            log.info("role: " + rolesJson);

        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            contentValue = null;
        }
        return contentValue;
    }
}
