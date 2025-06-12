package org.zerock.portfolio.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.IntStream;

@SpringBootTest
public class BoardRepositoryTests {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Test
    public void testListPage() {

        PageRequest pageRequest = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"));

        Page<Object[]> result = boardRepository.getListPage(pageRequest);

        for (Object[] obj : result.getContent() ) {
            System.out.println(Arrays.toString(obj));
        }
    }

    @Test
    public void testGetBoardWithReview() {

        List<Object[]> result = boardRepository.getBoardWithReview(100L);
        System.out.println(result);

        for (Object[] obj : result ) {
            System.out.println(Arrays.toString(obj));
        }
    }

    @Commit
    @Transactional
    @Test
    public void insertImage() {

        IntStream.rangeClosed(1, 100).forEach(i -> {

            Optional<BoardEntity> boardEntity = boardRepository.findById((long) i);

            if (boardEntity.isPresent()) {
                int count = (int) (Math.random() * 5) + 1;

                for (int j = 0; j < count; j++) {

                    ImageEntity imageEntity = ImageEntity.builder()
                            .fileName("test" + j + ".jpg")
                            .uuid(UUID.randomUUID().toString())
                            .board(boardEntity.get())
                            .build();

                    imageRepository.save(imageEntity);
                }
            }
        });
    }
}
