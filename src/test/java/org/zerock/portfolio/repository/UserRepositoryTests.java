package org.zerock.portfolio.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.portfolio.entity.UserEntity;

import java.util.stream.IntStream;

@SpringBootTest
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void insertUser() {

        IntStream.rangeClosed(1,100).forEach(i -> {
            UserEntity user = UserEntity.builder()
                    .email("user" + i +"@abc.com")
                    .password("1111")
                    .name("user" + i)
                    .phoneNumber("010-" + i + "-1234")
                    .fromSocial(false)
                    .role(0)
                    .build();
            userRepository.save(user);
        });
    }
}
