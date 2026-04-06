package org.zerock.portfolio.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;
import org.zerock.portfolio.entity.PlaceCategory;
import org.zerock.portfolio.entity.PetPlaceEntity;
import org.zerock.portfolio.entity.PetPlaceImgEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.repository.FavoriteRepository;
import org.zerock.portfolio.repository.PetPlaceImgRepository;
import org.zerock.portfolio.repository.PetPlaceRepository;
import org.zerock.portfolio.repository.PetPlaceReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(readOnly = true)
public class PetPlaceServiceImpl implements PetPlaceService {

    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceImgRepository petPlaceImgRepository;
    private final PetPlaceReviewRepository petPlaceReviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    @Override
    public PetPlaceResponse read(Long id, String email) {
        PetPlaceEntity place = petPlaceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("장소를 찾을 수 없습니다. id=" + id));

        List<PetPlaceImgEntity> imgs = petPlaceImgRepository.findByPetPlaceId(place.getId());
        List<PetPlaceReviewEntity> reviews = petPlaceReviewRepository.findByPetPlaceId(place.getId());

        double avg = reviews.isEmpty() ? 0 : reviews.stream()
                .mapToInt(PetPlaceReviewEntity::getRating)
                .average()
                .orElse(0);

        boolean favorited = false;
        if (email != null) {
            favorited = userRepository.findByEmail(email)
                    .map(user -> favoriteRepository.existsByUserIdAndPetPlaceId(user.getId(), place.getId()))
                    .orElse(false);
        }

        return toResponse(place, imgs, avg, reviews.size(), favorited);
    }

    @Override
    public PageResponse<PetPlaceResponse> getList(int page, int size, String category, String keyword) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<PetPlaceEntity> result;

        PlaceCategory cat = parseCategory(category);

        if (keyword != null && !keyword.isEmpty() && cat != null) {
            result = petPlaceRepository.searchByKeywordAndCategory(keyword, cat, pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
            result = petPlaceRepository.searchByKeyword(keyword, pageable);
        } else if (cat != null) {
            result = petPlaceRepository.findByCategory(cat, pageable);
        } else {
            result = petPlaceRepository.findAll(pageable);
        }

        // Batch fetch images for all places in one query to avoid N+1
        List<PetPlaceEntity> places = result.getContent();
        Map<Long, List<PetPlaceImgEntity>> imagesByPlaceId = batchFetchImages(places);

        List<PetPlaceResponse> content = places.stream()
                .map(p -> {
                    List<PetPlaceImgEntity> imgs = imagesByPlaceId.getOrDefault(p.getId(), Collections.emptyList());
                    return toResponse(p, imgs, 0, 0, false);
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

    @Override
    public List<PetPlaceResponse> getMapList() {
        return petPlaceRepository.findAll().stream()
                .map(p -> PetPlaceResponse.builder()
                        .id(p.getId())
                        .contentid(p.getContentid())
                        .title(p.getTitle())
                        .addr1(p.getAddr1())
                        .tel(p.getTel())
                        .mapx(p.getMapx())
                        .mapy(p.getMapy())
                        .category(p.getCategory() != null ? p.getCategory().name() : "OTHER")
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<PetPlaceResponse> search(String keyword, String category, Double lat, Double lng, Double radius, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        PlaceCategory cat = parseCategory(category);

        Page<PetPlaceEntity> result = petPlaceRepository.searchWithFilters(keyword, cat, lat, lng, radius, pageable);

        // Batch fetch images for all places in one query to avoid N+1
        List<PetPlaceEntity> places = result.getContent();
        Map<Long, List<PetPlaceImgEntity>> imagesByPlaceId = batchFetchImages(places);

        List<PetPlaceResponse> content = places.stream()
                .map(p -> {
                    List<PetPlaceImgEntity> imgs = imagesByPlaceId.getOrDefault(p.getId(), Collections.emptyList());
                    return toResponse(p, imgs, 0, 0, false);
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

    private PlaceCategory parseCategory(String category) {
        if (category == null || category.isEmpty()) {
            return null;
        }
        try {
            return PlaceCategory.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Batch fetch images for a list of places in a single query to avoid the N+1 problem.
     */
    private Map<Long, List<PetPlaceImgEntity>> batchFetchImages(List<PetPlaceEntity> places) {
        if (places.isEmpty()) {
            return Collections.emptyMap();
        }
        List<Long> placeIds = places.stream()
                .map(PetPlaceEntity::getId)
                .collect(Collectors.toList());
        return petPlaceImgRepository.findByPetPlaceIdIn(placeIds).stream()
                .collect(Collectors.groupingBy(img -> img.getPetPlace().getId()));
    }

    private PetPlaceResponse toResponse(PetPlaceEntity entity, List<PetPlaceImgEntity> imgs,
                                         double avgRating, int reviewCount, boolean favorited) {
        List<String> imageUrls = imgs.stream()
                .map(PetPlaceImgEntity::getOriginimgurl)
                .collect(Collectors.toList());

        String tel = entity.getTel();
        if (tel != null) {
            tel = tel.replace(".", "-");
        }

        return PetPlaceResponse.builder()
                .id(entity.getId())
                .contentid(entity.getContentid())
                .title(entity.getTitle())
                .addr1(entity.getAddr1())
                .tel(tel)
                .mapx(entity.getMapx())
                .mapy(entity.getMapy())
                .category(entity.getCategory() != null ? entity.getCategory().name() : "OTHER")
                .avgRating(avgRating)
                .reviewCount(reviewCount)
                .favorited(favorited)
                .imageUrls(imageUrls)
                .build();
    }
}
