package org.zerock.portfolio.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.List;

@SpringBootTest
public class BoardRepositoryTests {

    @Autowired
    private BoardRepository boardRepository;

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
}
