package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.PetProfileEntity;

import java.util.List;

public interface PetProfileRepository extends JpaRepository<PetProfileEntity, Long> {
    List<PetProfileEntity> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
