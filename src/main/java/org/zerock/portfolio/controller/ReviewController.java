package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.BoardReviewDTO;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.service.ReviewService;

@RestController
@RequestMapping("/api/review")
@Log4j2
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{boardId}/all")
    public ResponseEntity<PageResultDTO<BoardReviewDTO, ReviewEntity>> getList(@PathVariable("boardId") Long boardId, PageRequestDTO pageRequestDTO) {

        PageResultDTO<BoardReviewDTO, ReviewEntity> result = reviewService.getList(boardId, pageRequestDTO);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/{boardId}")
    public ResponseEntity<Long> register(@RequestBody BoardReviewDTO boardReviewDTO) {

        Long id = reviewService.register(boardReviewDTO);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @PutMapping("/{boardId}/{id}")
    public ResponseEntity<Long> modify(@PathVariable("id") Long id, @RequestBody BoardReviewDTO boardReviewDTO) {

        reviewService.modify(boardReviewDTO);
        log.info("---------reviewDTO: " + boardReviewDTO);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @DeleteMapping("/{boardId}/{id}")
    public ResponseEntity<Long> remove(@PathVariable("id") Long id) {

        reviewService.remove(id);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
