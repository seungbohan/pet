package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.*;
import org.zerock.portfolio.repository.*;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional(readOnly = true)
public class AdminPlaceServiceImpl implements AdminPlaceService {

    private final UserPlaceRepository userPlaceRepository;
    private final PetPlaceRepository petPlaceRepository;
    private final PetPlaceImgRepository petPlaceImgRepository;
    private final UserRepository userRepository;
    private final FeedRepository feedRepository;
    private final FeedReviewRepository feedReviewRepository;
    private final PetPlaceReviewRepository petPlaceReviewRepository;
    private final GeocodingService geocodingService;

    @Override
    @Transactional
    public void updatePlaceStatus(Long userPlaceId, PlaceStatus status) {
        UserPlaceEntity place = userPlaceRepository.findById(userPlaceId)
                .orElseThrow(() -> new IllegalArgumentException("제보를 찾을 수 없습니다."));
        place.setStatus(status);
        userPlaceRepository.save(place);

        if (status == PlaceStatus.APPROVED) {
            convertToPetPlace(place);
        }
    }

    @Override
    public Map<String, Long> getStats() {
        long totalUsers = userRepository.count();
        long userCount = userRepository.countByRole(UserRole.USER);
        long feedCount = feedRepository.count();
        long reviewCount = feedReviewRepository.count() + petPlaceReviewRepository.count();
        long placeCount = petPlaceRepository.count();

        return Map.of(
                "totalUsers", totalUsers,
                "userCount", userCount,
                "feedCount", feedCount,
                "reviewCount", reviewCount,
                "placeCount", placeCount
        );
    }

    private void convertToPetPlace(UserPlaceEntity place) {
        double mapx = place.getMapx();
        double mapy = place.getMapy();

        // Geocode fallback when coordinates are missing
        if (mapx == 0 && mapy == 0 && place.getAddr1() != null) {
            double[] coords = geocodingService.geocode(place.getAddr1());
            if (coords != null) {
                mapx = coords[0];
                mapy = coords[1];
            }
        }

        // Split comma-separated image URLs
        String[] imageUrls = place.getImageUrl() != null
                ? place.getImageUrl().split(",") : new String[0];
        String firstImage = imageUrls.length > 0 ? imageUrls[0].trim() : null;

        PetPlaceEntity petPlace = PetPlaceEntity.builder()
                .title(place.getTitle())
                .addr1(place.getAddr1())
                .tel(place.getTel())
                .mapx(mapx)
                .mapy(mapy)
                .category(place.getCategory() != null ? place.getCategory() : PlaceCategory.OTHER)
                .firstimage(firstImage)
                .build();
        petPlaceRepository.save(petPlace);

        // Save extra images to pet_place_img_entity
        for (int i = 1; i < imageUrls.length; i++) {
            String url = imageUrls[i].trim();
            if (!url.isEmpty()) {
                PetPlaceImgEntity img = PetPlaceImgEntity.builder()
                        .petPlace(petPlace)
                        .originimgurl(url)
                        .build();
                petPlaceImgRepository.save(img);
            }
        }
    }
}
