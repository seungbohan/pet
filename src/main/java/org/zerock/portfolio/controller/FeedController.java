package org.zerock.portfolio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.request.FeedRequest;
import org.zerock.portfolio.dto.response.FeedResponse;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.service.FeedService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/feeds")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    // [SECURITY] 페이지 크기 상한 제한 (MEDIUM-3 수정)
    private static final int MAX_PAGE_SIZE = 50;

    @GetMapping
    public ResponseEntity<PageResponse<FeedResponse>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(feedService.getList(page, size));
    }

    @GetMapping("/popular")
    public ResponseEntity<PageResponse<FeedResponse>> getPopularList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(feedService.getPopularList(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<FeedResponse>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(feedService.search(keyword, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedResponse> read(@PathVariable Long id) {
        return ResponseEntity.ok(feedService.read(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Long>> register(
            @Valid @RequestBody FeedRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Long id = feedService.register(request, email);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> modify(
            @PathVariable Long id,
            @Valid @RequestBody FeedRequest request,
            Authentication authentication) {
        feedService.modify(id, request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
            @PathVariable Long id,
            Authentication authentication) {
        feedService.remove(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
