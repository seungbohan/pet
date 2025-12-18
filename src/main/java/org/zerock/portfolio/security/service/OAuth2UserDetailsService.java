package org.zerock.portfolio.security.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.AuthUserDTO;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.UserRepository;

import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class OAuth2UserDetailsService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        String clientName = userRequest.getClientRegistration().getClientName();

        OAuth2User oAuth2User = super.loadUser(userRequest);

        oAuth2User.getAttributes().forEach((key, value) -> log.info(clientName + " : " + key + " : " + value));

        String email = null;

        if (clientName.equals("Google")) {
            email = oAuth2User.getAttribute("email");
        }

        UserEntity user = saveSocialUser(email);

        AuthUserDTO userAuthDTO = new AuthUserDTO(
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                true,
                user.getRoleSet().stream().map(
                        userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.name())
                ).collect(Collectors.toList()),
                oAuth2User.getAttributes()
        );
        userAuthDTO.setName(user.getName());

        return userAuthDTO;
    }

    private UserEntity saveSocialUser(String email) {

        Optional<UserEntity> result = userRepository.findByEmail(email, true);

        if (result.isPresent()) {
            return result.get();
        }

        UserEntity userEntity = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode("1111"))
                .name(email)
                .fromSocial(true)
                .build();

        userEntity.addUserRole(UserRole.USER);
        userRepository.save(userEntity);

        return userEntity;
    }
}
