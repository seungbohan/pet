package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.FavoriteEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.PetPlaceEntity;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {
    Optional<FavoriteEntity> findByUserAndPetPlace(UserEntity user, PetPlaceEntity petPlace);
    boolean existsByUserIdAndPetPlaceId(Long userId, Long petPlaceId);
    Page<FavoriteEntity> findByUserId(Long userId, Pageable pageable);
    void deleteByUserId(Long userId);
}
