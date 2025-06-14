package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.*;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;

import java.awt.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface BoardService {

    Long register(BoardDTO boardDTO);

    BoardDTO read(Long id);

    PageResultDTO<BoardDTO, Object[]> getList(PageRequestDTO pageRequestDTO);

    PageResultDTO<BoardDTO, Object[]> getPopularList(PageRequestDTO pageRequestDTO);

    MainPageResultDTO<BoardDTO, Object[]> getMainRecentList(PageRequestDTO pageRequestDTO);

    default Map<String ,Object> dtoToEntity(BoardDTO boardDTO) {
        Map<String ,Object> entityMap = new HashMap<>();

        BoardEntity boardEntity = BoardEntity.builder()
                .id(boardDTO.getId())
                .name(boardDTO.getName())
                .location(boardDTO.getLocation())
                .phoneNumber(boardDTO.getPhoneNumber())
                .build();

        entityMap.put("board", boardEntity);

        List<ImageDTO> imageDTOList = boardDTO.getImageDTOList();

        if (imageDTOList != null && imageDTOList.size() > 0) {
            List<ImageEntity> boardImageList = imageDTOList.stream().map(ImageDTO -> {

                ImageEntity imageEntity = ImageEntity.builder()
                        .folderPath(ImageDTO.getFolderPath())
                        .fileName(ImageDTO.getFileName())
                        .uuid(ImageDTO.getUuid())
                        .board(boardEntity)
                        .build();
                return imageEntity;
            }).collect(Collectors.toList());

            entityMap.put("imageList", boardImageList);
        }

        return entityMap;
    }

    default BoardDTO entityToDto(BoardEntity boardEntity) {
        BoardDTO boardDTO = BoardDTO.builder()
                .id(boardEntity.getId())
                .name(boardEntity.getName())
                .location(boardEntity.getLocation())
                .phoneNumber(boardEntity.getPhoneNumber())
                .build();
        return boardDTO;
    }

    default BoardDTO entitiesToDto(BoardEntity boardEntity, List<ImageEntity> imageEntities, Double avg, Long reviewCnt) {
        BoardDTO boardDTO = BoardDTO.builder()
                .id(boardEntity.getId())
                .name(boardEntity.getName())
                .location(boardEntity.getLocation())
                .phoneNumber(boardEntity.getPhoneNumber())
                .build();

        List<ImageDTO> imageDTOList = imageEntities.stream().map(imageEntity -> {
            return ImageDTO.builder()
                    .folderPath(imageEntity.getFolderPath())
                    .fileName(imageEntity.getFileName())
                    .uuid(imageEntity.getUuid())
                    .build();
        }).collect(Collectors.toList());

        boardDTO.setImageDTOList(imageDTOList);
        boardDTO.setAvg(avg);
        boardDTO.setReviewCnt(reviewCnt.intValue());
        return boardDTO;
    }
}
