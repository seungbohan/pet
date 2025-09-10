package org.zerock.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.*;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.service.BoardReviewService;
import org.zerock.portfolio.service.PetPlaceReviewService;

import java.util.Map;

@RestController
@RequestMapping("/api/review")
@Log4j2
@RequiredArgsConstructor
public class ReviewController {

    private final BoardReviewService boardReviewService;

    @GetMapping("/{boardId}/all")
    public ResponseEntity<?> getList(@PathVariable("boardId") Long boardId,
                                     PageRequestDTO pageRequestDTO) {

        PageResultDTO<BoardReviewDTO, BoardReviewEntity> result = boardReviewService.getList(boardId, pageRequestDTO);

        return ResponseEntity.ok(result);

    }

    @PostMapping("/{boardId}")
    public ResponseEntity<Long> register(@PathVariable("boardId") Long boardId,
                                         @RequestBody BoardReviewDTO boardReviewDTO) {

        Long id = boardReviewService.register(boardReviewDTO);

        return ResponseEntity.ok(id);

    }

    @PutMapping("/{boardId}/{id}")
    public ResponseEntity<Long> modify(@PathVariable("boardId") Long boardId,
                                       @PathVariable("id") Long id, @RequestBody BoardReviewDTO boardReviewDTO) {

        boardReviewService.modify(boardReviewDTO);

        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{boardId}/{id}")
    public ResponseEntity<Long> remove(@PathVariable("boardId") Long boardId,
                                       @PathVariable("id") Long id) {

        boardReviewService.remove(id);

        return ResponseEntity.ok(id);
    }
}
