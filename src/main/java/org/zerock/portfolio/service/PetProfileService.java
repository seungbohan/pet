package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.request.PetProfileRequest;
import org.zerock.portfolio.dto.response.PetProfileResponse;

import java.util.List;

public interface PetProfileService {
    List<PetProfileResponse> getMyPets(String email);
    Long register(PetProfileRequest request, String email);
    void modify(Long id, PetProfileRequest request, String email);
    void remove(Long id, String email);
}
