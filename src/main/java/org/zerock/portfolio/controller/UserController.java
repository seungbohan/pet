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

        if (updates.containsKey("name")) {
            user.changeName(updates.get("name"));
        }
        if (updates.containsKey("introduce")) {
            user.changeIntroduce(updates.get("introduce"));
        }
        if (updates.containsKey("profileImageUrl")) {
            user.changeProfileImageUrl(updates.get("profileImageUrl"));
        }
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
        return ResponseEntity.ok(feedService.getMyFeeds(authentication.getName(), page, size));
    }
}
