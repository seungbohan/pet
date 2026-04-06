package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.service.PetPlaceService;
import org.zerock.portfolio.service.PetPlaceSyncService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/places")
@RequiredArgsConstructor
@Log4j2
public class PetPlaceController {

    private final PetPlaceService petPlaceService;
    private final PetPlaceSyncService petPlaceSyncService;

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

    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> sync() {
        try {
            log.info("Manual sync triggered");
            petPlaceSyncService.sync();
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            log.error("Sync failed: ", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
