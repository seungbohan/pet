package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.PetPlaceReviewDTO;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.service.PetPlaceReviewService;

@RestController
@RequestMapping("/api/review/petPlace")
@Log4j2
@RequiredArgsConstructor
public class PetPlaceReviewController {

    private final PetPlaceReviewService petPlaceReviewService;

    @GetMapping("/{petPlaceId}")
    public ResponseEntity<?> getList(@PathVariable("petPlaceId") Long petPlaceId,
                                     PageRequestDTO pageRequestDTO) {

        PageResultDTO<PetPlaceReviewDTO, PetPlaceReviewEntity> result = petPlaceReviewService.getList(petPlaceId, pageRequestDTO);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{petPlaceId}")
    public ResponseEntity<Long> register(@PathVariable("petPlaceId") Long petPlaceId,
                                         @RequestBody PetPlaceReviewDTO petPlaceReviewDTO) {

        Long id = petPlaceReviewService.register(petPlaceReviewDTO);

        return ResponseEntity.ok(id);
    }

    @PutMapping("/{petPlaceId}/{id}")
    public ResponseEntity<Long> modify(@PathVariable("petPlaceId") Long petPlaceId,
                                       @PathVariable("id") Long id, @RequestBody PetPlaceReviewDTO petPlaceReviewDTO) {

        petPlaceReviewService.modify(petPlaceReviewDTO);

        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{petPlaceId}/{id}")
    public ResponseEntity<Long> remove(@PathVariable("petPlaceId") Long petPlaceId,
                                       @PathVariable("id") Long id) {

        petPlaceReviewService.remove(id);

        return ResponseEntity.ok(id);
    }
}
