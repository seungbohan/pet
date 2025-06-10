package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.MainPageResultDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.entity.BoardEntity;

import java.util.List;

public interface BoardService {

    Long register(BoardDTO boardDTO);

    BoardDTO read(Long id);

    PageResultDTO<BoardDTO, Object[]> getList(PageRequestDTO pageRequestDTO);

    PageResultDTO<BoardDTO, Object[]> getPopularList(PageRequestDTO pageRequestDTO);

    MainPageResultDTO<BoardDTO, Object[]> getMainRecentList(PageRequestDTO pageRequestDTO);

    default BoardEntity dtoToEntity(BoardDTO boardDTO) {
        BoardEntity boardEntity = BoardEntity.builder()
                .id(boardDTO.getId())
                .title(boardDTO.getTitle())
                .name(boardDTO.getName())
                .location(boardDTO.getLocation())
                .phoneNumber(boardDTO.getPhoneNumber())
                .build();
        return boardEntity;
    }

    default BoardDTO entityToDto(BoardEntity boardEntity) {
        BoardDTO boardDTO = BoardDTO.builder()
                .id(boardEntity.getId())
                .title(boardEntity.getTitle())
                .name(boardEntity.getName())
                .location(boardEntity.getLocation())
                .phoneNumber(boardEntity.getPhoneNumber())
                .build();
        return boardDTO;
    }

    default BoardDTO entitiesToDto(BoardEntity boardEntity, Double avg, Long reviewCnt) {
        BoardDTO boardDTO = BoardDTO.builder()
                .id(boardEntity.getId())
                .title(boardEntity.getTitle())
                .name(boardEntity.getName())
                .location(boardEntity.getLocation())
                .phoneNumber(boardEntity.getPhoneNumber())
                .build();

        boardDTO.setAvg(avg);
        boardDTO.setReviewCnt(reviewCnt.intValue());
        return boardDTO;
    }
}
