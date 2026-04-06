package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.PetPlaceResponse;

import java.util.List;

public interface PetPlaceService {
    PetPlaceResponse read(Long id, String email);
    PageResponse<PetPlaceResponse> getList(int page, int size, String category, String keyword, String areacode);
    List<PetPlaceResponse> getMapList();
    PageResponse<PetPlaceResponse> search(String keyword, String category, Double lat, Double lng, Double radius, int page, int size);
}
