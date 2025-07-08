package org.zerock.portfolio.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.zerock.portfolio.dto.BizDTO;
import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.entity.UserEntity;



public interface UserService {

    void register(UserDTO dto);

    void registerBiz(BizDTO dto);

    default UserEntity dtoToEntity(UserDTO dto) {
        System.out.println("UserServicedto / dtoToEntity() / dto : " + dto);
        UserEntity userEntity = UserEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .build();

        return userEntity;
    }

    default UserEntity bizDtoToEntity(BizDTO dto) {

        UserEntity userEntity = UserEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .bizName(dto.getBizName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .build();

        return userEntity;
    }
}
