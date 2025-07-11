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
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.entity.UserEntity;

import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

@SpringBootTest
public class ReviewRepositoryTests {

    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    public void insertReview() {

        IntStream.rangeClosed(1,300).forEach(i -> {

            //게시판 번호
            Long BoardId = (long) (Math.random() * 100) + 1;

            //회원 번호
            Long UserId = (long) (Math.random() * 100) + 1;
            UserEntity user = UserEntity.builder().id(UserId).build();

            ReviewEntity review = ReviewEntity.builder()
                    .user(user)
                    .board(BoardEntity.builder().id(BoardId).build())
                    .content("이 장소는 " + i)
                    .rating((int)(Math.random() * 5) + 1)
                    .build();

            reviewRepository.save(review);
        });
    }

//    @Test
//    public void testGetBoardReview() {
//
//        BoardEntity board = BoardEntity.builder().id(100L).build();
//
//        List<ReviewEntity> result = reviewRepository.findByBoard(board);
//
//        result.forEach(boardReview -> {
//            System.out.println(boardReview.getId());
//            System.out.println(boardReview.getContent());
//            System.out.println(boardReview.getRating());
//            System.out.println(boardReview.getUser().getName());
//
//            }
//        );
//    }


}
