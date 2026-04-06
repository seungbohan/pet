package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.service.PetPlaceService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/places")
@RequiredArgsConstructor
public class PetPlaceController {

    private final PetPlaceService petPlaceService;

    @GetMapping
    public ResponseEntity<PageResponse<PetPlaceResponse>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(petPlaceService.getList(page, size, category, keyword));
    }

    @GetMapping("/map")
    public ResponseEntity<List<PetPlaceResponse>> getMapList() {
        return ResponseEntity.ok(petPlaceService.getMapList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetPlaceResponse> getDetail(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(petPlaceService.read(id, email));
    }
}
