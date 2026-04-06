package org.zerock.portfolio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.portfolio.dto.request.PetProfileRequest;
import org.zerock.portfolio.dto.response.PetProfileResponse;
import org.zerock.portfolio.service.PetProfileService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
public class PetProfileController {

    private final PetProfileService petProfileService;

    @GetMapping
    public ResponseEntity<List<PetProfileResponse>> getMyPets(Authentication authentication) {
        return ResponseEntity.ok(petProfileService.getMyPets(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Long>> register(
            @Valid @RequestBody PetProfileRequest request,
            Authentication authentication) {
        Long id = petProfileService.register(request, authentication.getName());
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> modify(
            @PathVariable Long id,
            @Valid @RequestBody PetProfileRequest request,
            Authentication authentication) {
        petProfileService.modify(id, request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id, Authentication authentication) {
        petProfileService.remove(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
