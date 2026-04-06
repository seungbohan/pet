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

    // [SECURITY] 페이지 크기 상한 제한 (MEDIUM-3 수정)
    private static final int MAX_PAGE_SIZE = 50;

    @GetMapping
    public ResponseEntity<PageResponse<PetPlaceResponse>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(petPlaceService.getList(page, size, category, keyword));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<PetPlaceResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "5") Double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(petPlaceService.search(keyword, category, lat, lng, radius, page, size));
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
    public ResponseEntity<Map<String, String>> syncPlaces() {
        try {
            log.info("Manual places sync triggered");
            petPlaceSyncService.syncPlaces();
            return ResponseEntity.ok(Map.of("status", "success", "message", "장소 동기화 완료"));
        } catch (Exception e) {
            log.error("Sync failed: ", e);
            // [SECURITY] 내부 에러 메시지를 클라이언트에 노출하지 않음
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "error", "message", "동기화 중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/sync/images")
    public ResponseEntity<Map<String, String>> syncImages() {
        try {
            log.info("Manual images sync triggered");
            petPlaceSyncService.syncImages();
            return ResponseEntity.ok(Map.of("status", "success", "message", "이미지 동기화 완료"));
        } catch (Exception e) {
            log.error("Sync failed: ", e);
            // [SECURITY] 내부 에러 메시지를 클라이언트에 노출하지 않음
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "error", "message", "이미지 동기화 중 오류가 발생했습니다."));
        }
    }
}
