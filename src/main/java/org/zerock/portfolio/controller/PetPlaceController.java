package org.zerock.portfolio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.request.UserPlaceRequest;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.dto.response.UserPlaceResponse;
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
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String areacode) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(petPlaceService.getList(page, size, category, keyword, areacode));
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

    // Vote (추천/비추천)
    @PostMapping("/{id}/vote")
    public ResponseEntity<Map<String, Object>> vote(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            Authentication authentication) {
        boolean upvote = body.getOrDefault("upvote", true);
        return ResponseEntity.ok(petPlaceService.vote(id, upvote, authentication.getName()));
    }

    // 장소 이미지 추가 (회원만)
    @PostMapping("/{id}/images")
    public ResponseEntity<Map<String, String>> addPlaceImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(petPlaceService.addImage(id, imageUrl, authentication.getName()));
    }

    // Popular places ranking (인기 장소 랭킹)
    @GetMapping("/popular")
    public ResponseEntity<List<PetPlaceResponse>> getPopularPlaces(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(petPlaceService.getPopularPlaces(Math.min(limit, 50)));
    }

    // 장소 제보
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Long>> submitPlace(
            @Valid @RequestBody UserPlaceRequest request,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        Long id = petPlaceService.submitUserPlace(request, email);
        return ResponseEntity.ok(Map.of("id", id));
    }

    // 제보된 장소 목록 (대기중인 것들) - 공개
    @GetMapping("/submitted")
    public ResponseEntity<PageResponse<UserPlaceResponse>> getSubmittedPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(petPlaceService.getSubmittedPlaces(page, size));
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

    @GetMapping("/areas")
    public ResponseEntity<List<Map<String, String>>> getAreaCodes() {
        List<Map<String, String>> areas = List.of(
                Map.of("code", "1", "name", "서울"),
                Map.of("code", "2", "name", "인천"),
                Map.of("code", "3", "name", "대전"),
                Map.of("code", "4", "name", "대구"),
                Map.of("code", "5", "name", "광주"),
                Map.of("code", "6", "name", "부산"),
                Map.of("code", "7", "name", "울산"),
                Map.of("code", "8", "name", "세종"),
                Map.of("code", "31", "name", "경기도"),
                Map.of("code", "32", "name", "강원도"),
                Map.of("code", "33", "name", "충청북도"),
                Map.of("code", "34", "name", "충청남도"),
                Map.of("code", "35", "name", "경상북도"),
                Map.of("code", "36", "name", "경상남도"),
                Map.of("code", "37", "name", "전북특별자치도"),
                Map.of("code", "38", "name", "전라남도"),
                Map.of("code", "39", "name", "제주도")
        );
        return ResponseEntity.ok(areas);
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

    @PostMapping("/sync/update")
    public ResponseEntity<Map<String, String>> updateExistingPlaces() {
        try {
            log.info("Manual update sync triggered");
            petPlaceSyncService.updateExistingPlaces();
            return ResponseEntity.ok(Map.of("status", "success", "message", "기존 장소 업데이트 완료"));
        } catch (Exception e) {
            log.error("Update sync failed: ", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "error", "message", "업데이트 동기화 중 오류가 발생했습니다."));
        }
    }
}
