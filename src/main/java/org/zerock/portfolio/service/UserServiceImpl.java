package org.zerock.portfolio.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.entity.FeedEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;
import org.zerock.portfolio.repository.FeedRepository;
import org.zerock.portfolio.repository.FeedReviewRepository;
import org.zerock.portfolio.repository.ImageRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final EntityManager entityManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FeedRepository feedRepository;
    private final ImageRepository imageRepository;
    private final FeedReviewRepository feedReviewRepository;

    @Override
    @Transactional
    public void register(UserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다");
        }

        UserEntity userEntity = dtoToEntity(dto);
        // [SECURITY] setter 대신 명시적 변경 메서드 사용
        userEntity.changePassword(passwordEncoder.encode(dto.getPassword()));
        userEntity.addUserRole(UserRole.USER);

        userRepository.save(userEntity);
    }

    @Override
    @Transactional
    public void modify(String email, UserDTO dto) {

        log.info("modify : " + email + " / " + dto);
        Optional<UserEntity> result = userRepository.findByEmail(email);
        log.info("result : " + result);

        if (result.isPresent()) {

            UserEntity entity = result.get();

            entity.changeName(dto.getName());
            log.info("name : " + entity.getName());
            userRepository.save(entity);
        }
    }

    @Override
    public UserDTO findUser(String email) {

        Optional<UserEntity> result = userRepository.findByEmail(email);
        log.info("findUser : " + result + " / email : " + email);
        if (result.isPresent()) {
            UserEntity entity = result.get();
            log.info("findUser : " + entity);
            return entityTODto(entity);
        }

        return null;
    }

    @Override
    @Transactional
    public void delete(String email) {

        Optional<UserEntity> result = userRepository.findByEmail(email);
        log.info("delete : " + email + " / " + result);

        entityManager.clear();

        if (result.isPresent()) {
            UserEntity entity = result.get();
            feedReviewRepository.deleteByUserId(entity.getId());
            List<FeedEntity> feeds = feedRepository.findByUserId(entity.getId());
            imageRepository.deleteByUserId(entity.getId());
            feedRepository.deleteByUserId(entity.getId());
            userRepository.deleteById(entity.getId());
        } else {
            log.info("delete : " + email + " / not found");
        }
    }
}
