package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.BoardReviewDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.ReviewEntity;

public interface BoardReviewService {

    PageResultDTO<BoardReviewDTO, BoardReviewEntity> getList(Long boardId, PageRequestDTO pageRequestDTO);

    Long register(BoardReviewDTO boardReviewDTO);

    void modify(BoardReviewDTO boardReviewDTO);

    void remove(Long id);

    default BoardReviewEntity dtoToEntity(BoardReviewDTO boardReviewDTO) {

        BoardReviewEntity reviewEntity = BoardReviewEntity.builder()
                .id(boardReviewDTO.getId())
                .board(BoardEntity.builder().id(boardReviewDTO.getBoardId()).build())
                .content(boardReviewDTO.getContent())
                .build();
        return reviewEntity;
    }

    default BoardReviewDTO entityToDto(BoardReviewEntity reviewEntity) {
        BoardReviewDTO boardReviewDTO = BoardReviewDTO.builder()
                .id(reviewEntity.getId())
                .content(reviewEntity.getContent())
                .boardId(reviewEntity.getBoard().getId())
                .writer(reviewEntity.getUser().getName())
                .writerEmail(reviewEntity.getUser().getEmail())
                .regDate(reviewEntity.getRegDate())
                .modDate(reviewEntity.getModDate()).build();
        return boardReviewDTO;
    }

    default BoardReviewDTO entitiesToDto(BoardReviewEntity reviewEntity, Double avg) {
        BoardReviewDTO boardReviewDTO = BoardReviewDTO.builder()
                .id(reviewEntity.getId())
                .content(reviewEntity.getContent())
                .writer(reviewEntity.getUser().getName())
                .build();

        return boardReviewDTO;
    }
}
