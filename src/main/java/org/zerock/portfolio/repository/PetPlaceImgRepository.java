package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.PetPlaceImgEntity;

import java.util.Optional;

public interface PetPlaceImgRepository extends JpaRepository<PetPlaceImgEntity, Long> {

    Boolean existsByContentidAndOriginimgurl(Long contentid, String originimgurl);
    Optional<PetPlaceImgEntity> findByContentid(Long contentid);
}
