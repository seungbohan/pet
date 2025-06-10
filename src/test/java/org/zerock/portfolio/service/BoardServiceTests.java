package org.zerock.portfolio.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.portfolio.dto.BoardDTO;

import java.util.stream.IntStream;

@SpringBootTest
public class BoardServiceTests {

    @Autowired
    private BoardService boardService;

    @Test
    public void testRegister() {
        IntStream.rangeClosed(1, 100).forEach(i -> {
            BoardDTO boardDTO = BoardDTO.builder()
                    .title("게시판 제목" + i)
                    .name("장소" + i)
                    .location("주소" + i)
                    .phoneNumber("전화번호" + i)
                    .build();
            boardService.register(boardDTO);
        });
    }
}
