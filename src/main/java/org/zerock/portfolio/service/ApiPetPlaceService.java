package org.zerock.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.zerock.portfolio.dto.PetPlaceDTO;
import org.zerock.portfolio.dto.PetPlaceImgDTO;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceImgEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface ApiPetPlaceService {

    List<PetPlaceDTO> fetchAllPetPlace() throws Exception;

    List<PetPlaceImgDTO> fetchAllPetPlaceImg(List<PetPlaceDTO> dtos) throws Exception;

    List<PetPlaceDTO> getAllPetPlace();

    List<PetPlaceImgDTO> getAllPetPlaceImg();

    default PetPlaceDTO entityToDto(PetPlaceEntity entity) {

        PetPlaceDTO dto = PetPlaceDTO.builder()
                .contentid(entity.getContentid())
                .contenttypeid(entity.getContenttypeid())
                .tel(entity.getTel())
                .addr1(entity.getAddr1())
                .title(entity.getTitle())
                .mapx(entity.getMapx())
                .mapy(entity.getMapy())
                .build();

        return dto;
    }

    default PetPlaceImgDTO imgEntityTODto(PetPlaceImgEntity entity) {

        PetPlaceImgDTO dto = PetPlaceImgDTO.builder()
                .contentid(entity.getContentid())
                .imgname(entity.getImgname())
                .originimgurl(entity.getOriginimgurl())
                .build();

        return dto;
    }
}
