package org.zerock.portfolio.service;

import org.zerock.portfolio.entity.PlaceStatus;

import java.util.Map;

public interface AdminPlaceService {
    void updatePlaceStatus(Long userPlaceId, PlaceStatus status);
    Map<String, Long> getStats();
}
