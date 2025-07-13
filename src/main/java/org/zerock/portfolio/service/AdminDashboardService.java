package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.ImageDTO;
import org.zerock.portfolio.dto.UserCountDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface AdminDashboardService {

    Long boardCount();

    Long reviewCount();

    UserCountDTO userCount();

    Long register(BoardDTO boardDTO);

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
}
