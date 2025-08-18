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
    private final PetPlaceReviewService petPlaceReviewService;
    private final ObjectMapper objectMapper;

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
                                         @RequestBody Map<String ,Object> data) {

        switch (type){
            case "board":
                BoardReviewDTO boardReviewDTO = objectMapper.convertValue(data, BoardReviewDTO.class);
                boardReviewDTO.setBoardId(targetId);
                Long id = boardReviewService.register(boardReviewDTO);

                return ResponseEntity.ok(id);

            case "petPlace":
                PetPlaceReviewDTO petPlaceReviewDTO = objectMapper.convertValue(data, PetPlaceReviewDTO.class);
                petPlaceReviewDTO.setPetPlaceId(targetId);
                Long id2 = petPlaceReviewService.register(petPlaceReviewDTO);

                return ResponseEntity.ok(id2);

            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{type}/{targetId}/{id}")
    public ResponseEntity<Long> modify(@PathVariable("type") String type,@PathVariable("targetId") Long targetId,
                                       @PathVariable("id") Long id, @RequestBody Map<String ,Object> data) {

        switch (type) {
            case "board":
                BoardReviewDTO boardReviewDTO = objectMapper.convertValue(data, BoardReviewDTO.class);
                boardReviewDTO.setBoardId(targetId);
                boardReviewDTO.setId(id);
                boardReviewService.modify(boardReviewDTO);

                return new ResponseEntity<>(id, HttpStatus.OK);

            case "petPlace":
                PetPlaceReviewDTO petPlaceReviewDTO = objectMapper.convertValue(data, PetPlaceReviewDTO.class);
                petPlaceReviewDTO.setPetPlaceId(targetId);
                petPlaceReviewDTO.setId(id);
                petPlaceReviewService.modify(petPlaceReviewDTO);

                return new ResponseEntity<>(id, HttpStatus.OK);

            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{type}/{targetId}/{id}")
    public ResponseEntity<Long> remove(@PathVariable("type") String type, @PathVariable("targetId") Long targetId,
                                       @PathVariable("id") Long id) {

        switch (type) {
            case "board":
                boardReviewService.remove(id);

                return new ResponseEntity<>(id, HttpStatus.OK);
            case "petPlace":
                petPlaceReviewService.remove(id);

                return new ResponseEntity<>(id, HttpStatus.OK);
            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
