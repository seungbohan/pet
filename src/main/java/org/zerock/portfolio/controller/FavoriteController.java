package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.service.FavoriteService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<PageResponse<PetPlaceResponse>> getMyFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        return ResponseEntity.ok(favoriteService.getMyFavorites(authentication.getName(), page, size));
    }

    @PostMapping("/{placeId}")
    public ResponseEntity<Map<String, Boolean>> toggle(
            @PathVariable Long placeId,
            Authentication authentication) {
        return ResponseEntity.ok(favoriteService.toggle(placeId, authentication.getName()));
    }

    @GetMapping("/{placeId}/check")
    public ResponseEntity<Map<String, Boolean>> check(
            @PathVariable Long placeId,
            Authentication authentication) {
        boolean favorited = favoriteService.isFavorited(placeId, authentication.getName());
        return ResponseEntity.ok(Map.of("favorited", favorited));
    }
}
