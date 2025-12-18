package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.UserDTO;
import org.zerock.portfolio.entity.UserEntity;



public interface UserService {

    void register(UserDTO dto);

    void modify(String email,UserDTO dto);

    void delete(String email);

    UserDTO findUser(String email);

    default UserEntity dtoToEntity(UserDTO dto) {
        System.out.println("UserServicedto / dtoToEntity() / dto : " + dto);
        UserEntity userEntity = UserEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .build();

        return userEntity;
    }


    default UserDTO entityTODto(UserEntity entity) {

        UserDTO userDTO = UserDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .password(entity.getPassword())
                .email(entity.getEmail())
                .build();

        return userDTO;
    }
}
