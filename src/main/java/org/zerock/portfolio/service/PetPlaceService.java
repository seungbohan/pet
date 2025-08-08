package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.*;
import org.zerock.portfolio.entity.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public interface PetPlaceService {

    PetPlaceDTO read(Long id);

    PageResultDTO<PetPlaceDTO, Object[]> getList(PageRequestDTO pageRequestDTO);

    PageResultDTO<PetPlaceDTO, Object[]> getPopularList(PageRequestDTO pageRequestDTO);

    MainPageResultDTO<PetPlaceDTO, Object[]> getMainRecentList(PageRequestDTO pageRequestDTO);

    //  void registerApi(Map<String, Object> entityMap);

//    default Map<String ,Object> apiDtoToEntity(Map<String, Object> entityMap) {
//
//        Map<String ,Object> dtoMap = new HashMap<>();
//
//        BoardEntity boardEntity = (BoardEntity) entityMap.get("board");
//        List<ImageEntity> imageList = (List<ImageEntity>) entityMap.get("imageList");
//    }

    default Map<String ,Object> dtoToEntity(PetPlaceDTO petPlaceDTO) {
        Map<String ,Object> entityMap = new HashMap<>();

        PetPlaceEntity petPlaceEntity = PetPlaceEntity.builder()
                .id(petPlaceDTO.getContentid())
                .title(petPlaceDTO.getTitle())
                .addr1(petPlaceDTO.getAddr1())
                .tel(petPlaceDTO.getTel())
                .mapx(petPlaceDTO.getMapx())
                .mapy(petPlaceDTO.getMapy())
                .contentid(petPlaceDTO.getContentid())
                .contenttypeid(petPlaceDTO.getContenttypeid())
                .build();

        entityMap.put("petPlace", petPlaceEntity);

        List<PetPlaceImgDTO> imageDTOList = petPlaceDTO.getImageDTOList();

        if (imageDTOList != null && imageDTOList.size() > 0) {
            List<PetPlaceImgEntity> petPlaceImgEntityList = imageDTOList.stream().map(ImageDTO -> {

                PetPlaceImgEntity imageEntity = PetPlaceImgEntity.builder()
                        .contentid(ImageDTO.getContentid())
                        .originimgurl(ImageDTO.getOriginimgurl())
                        .imgname(ImageDTO.getImgname())
                        .petPlace(petPlaceEntity)
                        .build();
                return imageEntity;
            }).collect(Collectors.toList());

            entityMap.put("imageList", petPlaceImgEntityList);
        }

        return entityMap;
    }

    default PetPlaceDTO entityToDto(PetPlaceEntity petPlaceEntity) {
        PetPlaceDTO petPlaceDTO = PetPlaceDTO.builder()
                .id(petPlaceEntity.getId())
                .title(petPlaceEntity.getTitle())
                .addr1(petPlaceEntity.getAddr1())
                .tel(petPlaceEntity.getAddr1())
                .mapx(petPlaceEntity.getMapx())
                .mapy(petPlaceEntity.getMapy())
                .contenttypeid(petPlaceEntity.getContenttypeid())
                .contentid(petPlaceEntity.getContentid())
                .build();
        return petPlaceDTO;
    }

    default PetPlaceDTO entitiesToDto(PetPlaceEntity petPlaceEntity, List<PetPlaceImgEntity> imageEntities, Double avg, Long reviewCnt) {
        PetPlaceDTO petPlaceDTO = PetPlaceDTO.builder()
                .id(petPlaceEntity.getId())
                .title(petPlaceEntity.getTitle())
                .addr1(petPlaceEntity.getAddr1())
                .tel(petPlaceEntity.getAddr1())
                .mapx(petPlaceEntity.getMapx())
                .mapy(petPlaceEntity.getMapy())
                .contenttypeid(petPlaceEntity.getContenttypeid())
                .contentid(petPlaceEntity.getContentid())
                .build();

        List<PetPlaceImgDTO> imageDTOList = imageEntities.stream().filter(Objects::nonNull).map(imageEntity -> {
            return PetPlaceImgDTO.builder()
                    .contentid(imageEntity.getContentid())
                    .originimgurl(imageEntity.getOriginimgurl())
                    .imgname(imageEntity.getImgname())
                    .build();
        }).collect(Collectors.toList());

        petPlaceDTO.setImageDTOList(imageDTOList);
        petPlaceDTO.setAvg(avg);
        petPlaceDTO.setReviewCnt(reviewCnt.intValue());
        return petPlaceDTO;
    }
}
