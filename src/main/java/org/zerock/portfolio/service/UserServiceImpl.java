package org.zerock.portfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.BizDTO;
import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void register(UserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다");
        }

        UserEntity userEntity = dtoToEntity(dto);
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userEntity.addUserRole(UserRole.USER);


        userRepository.save(userEntity);
    }

    @Override
    public void registerBiz(BizDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다");
        }

        UserEntity userEntity = bizDtoToEntity(dto);
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userEntity.addUserRole(UserRole.USER);
        userEntity.addUserRole(UserRole.BIZ);

        userRepository.save(userEntity);
    }
}
