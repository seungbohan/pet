package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.BoardReviewDTO;
import org.zerock.portfolio.dto.PetPlaceReviewDTO;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.service.BoardReviewService;
import org.zerock.portfolio.service.PetPlaceReviewService;

@RestController
@RequestMapping("/api/review")
@Log4j2
@RequiredArgsConstructor
public class ReviewController {

    private final BoardReviewService boardReviewService;
    private final PetPlaceReviewService petPlaceReviewService;

    @GetMapping("/{type}/{targetId}/all")
    public ResponseEntity<?> getList(@PathVariable("type") String type,
                                     @PathVariable("targetId") Long targetId,
                                     PageRequestDTO pageRequestDTO) {

        switch (type) {
            case "board":
                PageResultDTO<BoardReviewDTO, BoardReviewEntity> result = boardReviewService.getList(targetId, pageRequestDTO);
                return new ResponseEntity<>(result, HttpStatus.OK);
            case "petPlace":
                PageResultDTO<PetPlaceReviewDTO, PetPlaceReviewEntity> result2 = petPlaceReviewService.getList(targetId, pageRequestDTO);
                return new ResponseEntity<>(result2, HttpStatus.OK);
            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        }
    }

    @PostMapping("/{type}/{targetId}")
    public ResponseEntity<Long> register(@PathVariable("type") String type,
                                         @PathVariable("targetId") Long targetId,
                                         @RequestBody BoardReviewDTO boardReviewDTO) {

        Long id = boardReviewService.register(boardReviewDTO);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @PutMapping("/{boardId}/{id}")
    public ResponseEntity<Long> modify(@PathVariable("id") Long id, @RequestBody BoardReviewDTO boardReviewDTO) {

        boardReviewService.modify(boardReviewDTO);
        log.info("---------reviewDTO: " + boardReviewDTO);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @DeleteMapping("/{boardId}/{id}")
    public ResponseEntity<Long> remove(@PathVariable("id") Long id) {

        boardReviewService.remove(id);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
