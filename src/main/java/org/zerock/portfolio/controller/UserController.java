package org.zerock.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.response.FeedResponse;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.UserResponse;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.UserRepository;
import org.zerock.portfolio.service.FeedService;
import org.zerock.portfolio.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final FeedService feedService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        UserEntity user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<String> roles = user.getRoleSet().stream()
                .map(Enum::name)
                .collect(Collectors.toList());

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImageUrl(user.getProfileImageUrl())
                .introduce(user.getIntroduce())
                .fromSocial(user.isFromSocial())
                .roles(roles)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateMe(
            Authentication authentication,
            @RequestBody Map<String, String> updates) {
        String email = authentication.getName();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // [SECURITY] 허용된 필드만 업데이트 - Mass Assignment 방어 강화
        if (updates.containsKey("name")) {
            String name = updates.get("name");
            if (name != null && name.length() <= 50) {
                user.changeName(name.trim());
            }
        }
        if (updates.containsKey("introduce")) {
            String introduce = updates.get("introduce");
            if (introduce != null && introduce.length() <= 500) {
                user.changeIntroduce(introduce.trim());
            }
        }
        if (updates.containsKey("profileImageUrl")) {
            String url = updates.get("profileImageUrl");
            if (url != null && url.length() <= 500) {
                user.changeProfileImageUrl(url.trim());
            }
        }
        // [SECURITY] email, password, role 등 민감 필드 변경 시도 무시 (명시적 거부)
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(Authentication authentication) {
        userService.delete(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/feeds")
    public ResponseEntity<PageResponse<FeedResponse>> getMyFeeds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        // [SECURITY] 페이지 크기 상한 제한 (MEDIUM-3 수정)
        size = Math.min(Math.max(size, 1), 50);
        page = Math.max(page, 0);
        return ResponseEntity.ok(feedService.getMyFeeds(authentication.getName(), page, size));
    }
}
