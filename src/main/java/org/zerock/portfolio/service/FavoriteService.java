package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;

import java.util.Map;

public interface FavoriteService {
    Map<String, Boolean> toggle(Long placeId, String email);
    boolean isFavorited(Long placeId, String email);
    PageResponse<PetPlaceResponse> getMyFavorites(String email, int page, int size);
}
