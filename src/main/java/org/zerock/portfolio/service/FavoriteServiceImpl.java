package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.entity.FavoriteEntity;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceImgEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.FavoriteRepository;
import org.zerock.portfolio.repository.PetPlaceImgRepository;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceImgRepository petPlaceImgRepository;

    @Override
    public Map<String, Boolean> toggle(Long placeId, String email) {
        UserEntity user = findUser(email);
        PetPlaceEntity place = petPlaceRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다."));

        Optional<FavoriteEntity> existing = favoriteRepository.findByUserAndPetPlace(user, place);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return Map.of("favorited", false);
        } else {
            FavoriteEntity fav = FavoriteEntity.builder()
                    .user(user)
                    .petPlace(place)
                    .build();
            favoriteRepository.save(fav);
            return Map.of("favorited", true);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorited(Long placeId, String email) {
        UserEntity user = findUser(email);
        return favoriteRepository.existsByUserIdAndPetPlaceId(user.getId(), placeId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PetPlaceResponse> getMyFavorites(String email, int page, int size) {
        UserEntity user = findUser(email);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<FavoriteEntity> result = favoriteRepository.findByUserId(user.getId(), pageable);

        List<PetPlaceResponse> content = result.getContent().stream()
                .map(fav -> {
                    PetPlaceEntity place = fav.getPetPlace();
                    List<String> imageUrls = petPlaceImgRepository.findByPetPlaceId(place.getId())
                            .stream().map(PetPlaceImgEntity::getOriginimgurl).collect(Collectors.toList());
                    return PetPlaceResponse.builder()
                            .id(place.getId())
                            .title(place.getTitle())
                            .addr1(place.getAddr1())
                            .tel(place.getTel())
                            .mapx(place.getMapx())
                            .mapy(place.getMapy())
                            .category(place.getCategory() != null ? place.getCategory().name() : "OTHER")
                            .favorited(true)
                            .imageUrls(imageUrls)
                            .build();
                })
                .collect(Collectors.toList());

        return PageResponse.<PetPlaceResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    private UserEntity findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}
