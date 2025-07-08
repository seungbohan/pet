package org.zerock.portfolio.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.portfolio.dto.ReviewDTO;

import java.util.List;

@SpringBootTest
public class ReviewServiceTests {

    @Autowired
    private ReviewService reviewService;

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
