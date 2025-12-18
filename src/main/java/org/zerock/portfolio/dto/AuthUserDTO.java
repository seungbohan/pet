package org.zerock.portfolio.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Log4j2
@Getter
@Setter
@ToString
public class AuthUserDTO extends User implements OAuth2User {

    private String email;
    private String password;
    private String name;
    private boolean fromSocial;
    private Map<String, Object> attr;

    public AuthUserDTO(
            String email, String password, String name, boolean fromSocial,
            Collection<? extends GrantedAuthority> authorities, Map<String, Object> attr
    ) {
        this(email,password,name,fromSocial,authorities);
        this.attr = attr;
    }

    public AuthUserDTO(
            String email, String password, String name, boolean fromSocial,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(email,password,authorities);
        this.email = email;
        this.password = password;
        this.name = name;
        this.fromSocial = fromSocial;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return this.attr;
    }
}
