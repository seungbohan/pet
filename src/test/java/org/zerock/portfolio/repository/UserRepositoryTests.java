package org.zerock.portfolio.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;

import java.util.List;
import java.util.stream.IntStream;

@SpringBootTest
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertUser() {

//        IntStream.rangeClosed(1,100).forEach(i -> {
//            UserEntity user = UserEntity.builder()
//                    .email("user" + i +"@abc.com")
//                    .password("1111")
//                    .name("user" + i)
//                    .phoneNumber("010-" + i + "-1234")
//                    .fromSocial(false)
//                    .build();
//            userRepository.save(user);
//        });

        UserEntity user = UserEntity.builder()
                .email("aa@aa.com")
                .password(passwordEncoder.encode("qwer1234@@"))
                .name("aaa")
                .fromSocial(false)
                .build();

        user.addUserRole(UserRole.USER);
        user.addUserRole(UserRole.BIZ);
        user.addUserRole(UserRole.ADMIN);
        userRepository.save(user);


    }

    @Transactional
    @Rollback(false)
    @Test
    public void updateUser() {
        List<UserEntity> users = userRepository.findAll();

        for (UserEntity user : users) {
            user.setPassword(passwordEncoder.encode("1111"));

            user.addUserRole(UserRole.USER);

            if (user.getId() > 80) {
                user.addUserRole(UserRole.BIZ);
            }

            if (user.getId() > 90) {
                user.addUserRole(UserRole.ADMIN);
            }
        }
    }
}
