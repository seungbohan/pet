package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.UserPlaceEntity;
import org.zerock.portfolio.entity.PlaceStatus;

public interface UserPlaceRepository extends JpaRepository<UserPlaceEntity, Long> {
    Page<UserPlaceEntity> findByStatus(PlaceStatus status, Pageable pageable);
    Page<UserPlaceEntity> findByUserId(Long userId, Pageable pageable);
}
