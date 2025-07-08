package org.zerock.portfolio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.ReviewDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.entity.UserEntity;

import java.util.List;

public interface ReviewService {

    PageResultDTO<ReviewDTO, ReviewEntity> getList(Long boardId, PageRequestDTO pageRequestDTO);

    Long register(ReviewDTO reviewDTO);

    void modify(ReviewDTO reviewDTO);

    void remove(Long id);

    default ReviewEntity dtoToEntity(ReviewDTO reviewDTO) {

        ReviewEntity reviewEntity = ReviewEntity.builder()
                .id(reviewDTO.getId())
                .board(BoardEntity.builder().id(reviewDTO.getBoardId()).build())
                .content(reviewDTO.getContent())
                .rating(reviewDTO.getRating())
                .build();
        return reviewEntity;
    }

    default ReviewDTO entityToDto(ReviewEntity reviewEntity) {
        ReviewDTO reviewDTO = ReviewDTO.builder()
                .id(reviewEntity.getId())
                .content(reviewEntity.getContent())
                .rating(reviewEntity.getRating())
                .boardId(reviewEntity.getBoard().getId())
                .writer(reviewEntity.getUser().getName())
                .writerEmail(reviewEntity.getUser().getEmail())
                .regDate(reviewEntity.getRegDate())
                .modDate(reviewEntity.getModDate()).build();
        return reviewDTO;
    }

    default ReviewDTO entitiesToDto(ReviewEntity reviewEntity, Double avg) {
        ReviewDTO reviewDTO = ReviewDTO.builder()
                .id(reviewEntity.getId())
                .content(reviewEntity.getContent())
                .rating(reviewEntity.getRating())
                .writer(reviewEntity.getUser().getName())
                .build();

        return reviewDTO;
    }
}
