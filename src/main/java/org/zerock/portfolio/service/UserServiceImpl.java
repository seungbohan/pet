package org.zerock.portfolio.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.BizDTO;
import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.UserRepository;

import java.util.Optional;

@Log4j2
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

    @Override
    public void modify(String email,UserDTO dto) {

        log.info("modify : " + email + " / " + dto);
        Optional<UserEntity> result = userRepository.findByEmail(email, false);
        log.info("result : " + result);

        if (result.isPresent()) {

            UserEntity entity = result.get();

            entity.setName(dto.getName());
            log.info("name : " + entity.getName());
            userRepository.save(entity);
        }

    }

    @Override
    public UserDTO findUser(String email) {

        Optional<UserEntity> result = userRepository.findByEmail(email, false);
        log.info("findUser : " + result + " / email : " + email);
        if(result.isPresent()) {
            UserEntity entity = result.get();
            log.info("findUser : " + entity);
            return entityTODto(entity);
        }

        return null;
    }

    @Override
    public void delete(String email) {

        Optional<UserEntity> result = userRepository.findByEmail(email, false);
        log.info("delete : " + email + " / " + result);

        if(result.isPresent()) {
            UserEntity entity = result.get();
            userRepository.delete(entity);
        } else {
            log.info("delete : " + email + " / not found");
        }
    }
}
