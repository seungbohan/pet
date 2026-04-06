package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.request.PetProfileRequest;
import org.zerock.portfolio.dto.response.PetProfileResponse;
import org.zerock.portfolio.entity.PetProfileEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.PetProfileRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PetProfileServiceImpl implements PetProfileService {

    private final PetProfileRepository petProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PetProfileResponse> getMyPets(String email) {
        UserEntity user = findUser(email);
        return petProfileRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Long register(PetProfileRequest request, String email) {
        UserEntity user = findUser(email);
        PetProfileEntity pet = PetProfileEntity.builder()
                .user(user)
                .name(request.getName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .birthYear(request.getBirthYear())
                .weight(request.getWeight())
                .profileImageUrl(request.getProfileImageUrl())
                .introduction(request.getIntroduction())
                .build();
        petProfileRepository.save(pet);
        return pet.getId();
    }

    @Override
    public void modify(Long id, PetProfileRequest request, String email) {
        UserEntity user = findUser(email);
        PetProfileEntity pet = petProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("반려동물 프로필을 찾을 수 없습니다."));
        if (!pet.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }
        pet.update(request.getName(), request.getSpecies(), request.getBreed(),
                request.getBirthYear(), request.getWeight(),
                request.getProfileImageUrl(), request.getIntroduction());
    }

    @Override
    public void remove(Long id, String email) {
        UserEntity user = findUser(email);
        PetProfileEntity pet = petProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("반려동물 프로필을 찾을 수 없습니다."));
        if (!pet.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        petProfileRepository.delete(pet);
    }

    private UserEntity findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    private PetProfileResponse toResponse(PetProfileEntity entity) {
        return PetProfileResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .species(entity.getSpecies())
                .breed(entity.getBreed())
                .birthYear(entity.getBirthYear())
                .weight(entity.getWeight())
                .profileImageUrl(entity.getProfileImageUrl())
                .introduction(entity.getIntroduction())
                .regDate(entity.getRegDate())
                .modDate(entity.getModDate())
                .build();
    }
}
