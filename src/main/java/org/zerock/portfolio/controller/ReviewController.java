package org.zerock.portfolio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.request.ReviewRequest;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.ReviewResponse;
import org.zerock.portfolio.service.FeedReviewService;
import org.zerock.portfolio.service.PetPlaceReviewService;
import org.zerock.portfolio.service.ReviewService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final FeedReviewService feedReviewService;
    private final PetPlaceReviewService petPlaceReviewService;
    private final ReviewService reviewService;

    // Feed Reviews
    @GetMapping("/api/v1/feeds/{feedId}/reviews")
    public ResponseEntity<PageResponse<ReviewResponse>> getFeedReviews(
            @PathVariable Long feedId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(feedReviewService.getList(feedId, page));
    }

    @PostMapping("/api/v1/feeds/{feedId}/reviews")
    public ResponseEntity<Map<String, Long>> createFeedReview(
            @PathVariable Long feedId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        Long id = feedReviewService.register(feedId, request, authentication.getName());
        return ResponseEntity.ok(Map.of("id", id));
    }

    // Place Reviews
    @GetMapping("/api/v1/places/{placeId}/reviews")
    public ResponseEntity<PageResponse<ReviewResponse>> getPlaceReviews(
            @PathVariable Long placeId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(petPlaceReviewService.getListResponse(placeId, page));
    }

    @PostMapping("/api/v1/places/{placeId}/reviews")
    public ResponseEntity<Map<String, Long>> createPlaceReview(
            @PathVariable Long placeId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : null;
        Long id = petPlaceReviewService.registerWithResponse(placeId, request, email);
        return ResponseEntity.ok(Map.of("id", id));
    }

    // Common - delegates to unified ReviewService which determines the review type first
    @PutMapping("/api/v1/reviews/{id}")
    public ResponseEntity<Void> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        reviewService.modify(id, request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/v1/reviews/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            Authentication authentication) {
        reviewService.remove(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
