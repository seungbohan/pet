package org.zerock.portfolio.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.ImageDTO;
import org.zerock.portfolio.entity.BoardEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class BoardServiceTests {

    @Autowired
    private BoardService boardService;

//    @Test
//    public void testRegister() {
//        IntStream.rangeClosed(1, 100).forEach(i -> {
//
//            List<ImageDTO> imageDTOList = new ArrayList<>();
//
//            int count = (int) (Math.random() * 5) + 1;
//            for (int j = 0; j < count; j++) {
//                ImageDTO imageDTO = ImageDTO.builder()
//                        .fileName("test" + j + ".jpg")
//                        .uuid(UUID.randomUUID().toString())
//                        .build();
//                imageDTOList.add(imageDTO);
//            }
//
//            BoardDTO boardDTO = BoardDTO.builder()
//                    .name("장소" + i)
//                    .location("주소" + i)
//                    .phoneNumber("전화번호" + i)
//                    .imageDTOList(imageDTOList)
//                    .build();
//            boardService.register(boardDTO);
//        });
//    }
}
