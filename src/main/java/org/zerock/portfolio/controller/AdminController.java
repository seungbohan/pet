package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.response.FeedResponse;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.dto.response.UserResponse;
import org.zerock.portfolio.entity.*;
import org.zerock.portfolio.repository.*;
import org.zerock.portfolio.service.FeedService;
import org.zerock.portfolio.service.GeocodingService;
import org.zerock.portfolio.service.PetPlaceService;
import org.zerock.portfolio.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    // [SECURITY] 페이지 크기 상한 제한 (MEDIUM-3 수정)
    private static final int MAX_PAGE_SIZE = 100;

    private final UserRepository userRepository;
    private final FeedRepository feedRepository;
    private final FeedReviewRepository feedReviewRepository;
    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceReviewRepository petPlaceReviewRepository;
    private final FeedService feedService;
    private final UserService userService;
    private final PetPlaceService petPlaceService;
    private final UserPlaceRepository userPlaceRepository;
    private final GeocodingService geocodingService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long totalUsers = userRepository.count();
        long userCount = userRepository.countByRole(UserRole.USER);
        long feedCount = feedRepository.count();
        long reviewCount = feedReviewRepository.count() + petPlaceReviewRepository.count();
        long placeCount = petPlaceRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "userCount", userCount,
                "feedCount", feedCount,
                "reviewCount", reviewCount,
                "placeCount", placeCount
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<UserEntity> result = userRepository.findAll(pageable);

        List<UserResponse> content = result.getContent().stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .name(u.getName())
                        .profileImageUrl(u.getProfileImageUrl())
                        .fromSocial(u.isFromSocial())
                        .roles(u.getRoleSet().stream().map(Enum::name).collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(PageResponse.<UserResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String roleName = body.get("role");
        UserRole newRole = UserRole.valueOf(roleName);

        user.getRoleSet().clear();
        user.addUserRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        userService.delete(user.getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/feeds")
    public ResponseEntity<PageResponse<FeedResponse>> getFeeds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(feedService.getList(page, size));
    }

    @DeleteMapping("/feeds/{id}")
    public ResponseEntity<Void> deleteFeed(@PathVariable Long id) {
        var feed = feedRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("피드를 찾을 수 없습니다."));
        feedService.remove(id, feed.getUser().getEmail());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/places")
    public ResponseEntity<PageResponse<PetPlaceResponse>> getPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        return ResponseEntity.ok(petPlaceService.getList(page, size, null, null, null));
    }

    @PutMapping("/places/{id}/status")
    public ResponseEntity<Void> updatePlaceStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        UserPlaceEntity place = userPlaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("제보를 찾을 수 없습니다."));
        PlaceStatus status = PlaceStatus.valueOf(body.get("status"));
        place.setStatus(status);
        userPlaceRepository.save(place);

        // 승인 시 PetPlaceEntity로 변환하여 실제 지도에 추가
        if (status == PlaceStatus.APPROVED) {
            double mapx = place.getMapx();
            double mapy = place.getMapy();

            // 좌표가 없으면 주소로 지오코딩
            if (mapx == 0 && mapy == 0 && place.getAddr1() != null) {
                double[] coords = geocodingService.geocode(place.getAddr1());
                if (coords != null) {
                    mapx = coords[0];
                    mapy = coords[1];
                }
            }

            PetPlaceEntity petPlace = PetPlaceEntity.builder()
                    .title(place.getTitle())
                    .addr1(place.getAddr1())
                    .tel(place.getTel())
                    .mapx(mapx)
                    .mapy(mapy)
                    .category(place.getCategory() != null ? place.getCategory() : PlaceCategory.OTHER)
                    .firstimage(place.getImageUrl())
                    .build();
            petPlaceRepository.save(petPlace);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/submissions")
    public ResponseEntity<PageResponse<Map<String, Object>>> getSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "PENDING") String status) {
        size = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        page = Math.max(page, 0);
        PlaceStatus placeStatus = PlaceStatus.valueOf(status);
        Page<UserPlaceEntity> result = userPlaceRepository.findByStatus(
                placeStatus, PageRequest.of(page, size, Sort.by("id").descending()));

        List<Map<String, Object>> content = result.getContent().stream()
                .map(e -> Map.<String, Object>of(
                        "id", e.getId(),
                        "title", e.getTitle(),
                        "addr1", e.getAddr1() != null ? e.getAddr1() : "",
                        "tel", e.getTel() != null ? e.getTel() : "",
                        "category", e.getCategory() != null ? e.getCategory().name() : "OTHER",
                        "description", e.getDescription() != null ? e.getDescription() : "",
                        "imageUrl", e.getImageUrl() != null ? e.getImageUrl() : "",
                        "status", e.getStatus().name(),
                        "submitterName", e.getUser() != null ? e.getUser().getName() : "비회원",
                        "regDate", e.getRegDate() != null ? e.getRegDate().toString() : ""
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(PageResponse.<Map<String, Object>>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build());
    }
}
