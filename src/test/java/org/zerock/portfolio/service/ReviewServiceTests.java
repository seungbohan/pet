package org.zerock.portfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ReviewServiceTests {

    @Autowired
    private BoardReviewService boardReviewService;

//    @Test
//    public void testRegister() {
//
//        ReviewDTO reviewDTO = ReviewDTO.builder()
//                .content("review1")
//                .writer("writer1")
//                .rating(5)
//                .build();
//
//        System.out.println(reviewService.register(reviewDTO));
//    }
}
