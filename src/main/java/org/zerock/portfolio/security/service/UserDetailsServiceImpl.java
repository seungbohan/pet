package org.zerock.portfolio.security.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.UserRepository;
import org.zerock.portfolio.security.dto.UserAuthDTO;

import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<UserEntity> result = userRepository.findByEmail(username, false);

        if (!result.isPresent()) {
            throw new UsernameNotFoundException("Check Email or Social");
        }

        UserEntity userEntity = result.get();

        UserAuthDTO userAuthDTO = new UserAuthDTO(
                userEntity.getEmail(),
                userEntity.getPassword(),
                userEntity.isFromSocial(),
                userEntity.getRoleSet().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_"+role.name())).collect(Collectors.toSet())
        );

        userAuthDTO.setName(userEntity.getName());
        userAuthDTO.setFromSocial(userEntity.isFromSocial());

        return userAuthDTO;
    }
}
