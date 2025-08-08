package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.BoardReviewDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.PetPlaceReviewDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;

public interface PetPlaceReviewService {

    PageResultDTO<PetPlaceReviewDTO, PetPlaceReviewEntity> getList(Long petPlaceId, PageRequestDTO pageRequestDTO);

    Long register(PetPlaceReviewDTO petPlaceReviewDTO);

    void modify(PetPlaceReviewDTO petPlaceReviewDTO);

    void remove(Long id);

    default PetPlaceReviewEntity dtoToEntity(PetPlaceReviewDTO petPlaceReviewDTO) {

        PetPlaceReviewEntity reviewEntity = PetPlaceReviewEntity.builder()
                .id(petPlaceReviewDTO.getId())
                .petPlace(PetPlaceEntity.builder().id(petPlaceReviewDTO.getPetPlaceId()).build())
                .content(petPlaceReviewDTO.getContent())
                .rating(petPlaceReviewDTO.getRating())
                .build();
        return reviewEntity;
    }

    default PetPlaceReviewDTO entityToDto(PetPlaceReviewEntity reviewEntity) {
        PetPlaceReviewDTO petPlaceReviewDTO = PetPlaceReviewDTO.builder()
                .id(reviewEntity.getId())
                .content(reviewEntity.getContent())
                .rating(reviewEntity.getRating())
                .petPlaceId(reviewEntity.getPetPlace().getId())
                .writer(reviewEntity.getUser().getName())
                .writerEmail(reviewEntity.getUser().getEmail())
                .regDate(reviewEntity.getRegDate())
                .modDate(reviewEntity.getModDate()).build();
        return petPlaceReviewDTO;
    }

    default PetPlaceReviewDTO entitiesToDto(PetPlaceReviewEntity reviewEntity, Double avg) {
        PetPlaceReviewDTO petPlaceReviewDTO = PetPlaceReviewDTO.builder()
                .id(reviewEntity.getId())
                .content(reviewEntity.getContent())
                .rating(reviewEntity.getRating())
                .writer(reviewEntity.getUser().getName())
                .build();

        return petPlaceReviewDTO;
    }
}
