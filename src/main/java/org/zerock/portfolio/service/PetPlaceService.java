package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;

import java.util.List;
import java.util.Map;

public interface PetPlaceService {
    PetPlaceResponse read(Long id, String email);
    PageResponse<PetPlaceResponse> getList(int page, int size, String category, String keyword, String areacode);
    List<PetPlaceResponse> getMapList();
    PageResponse<PetPlaceResponse> search(String keyword, String category, Double lat, Double lng, Double radius, int page, int size);
    Map<String, Object> vote(Long placeId, boolean upvote, String email);
    List<PetPlaceResponse> getPopularPlaces(int limit);
}
