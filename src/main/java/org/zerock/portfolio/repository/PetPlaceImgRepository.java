package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.portfolio.entity.PetPlaceImgEntity;

import java.util.List;
import java.util.Optional;

public interface PetPlaceImgRepository extends JpaRepository<PetPlaceImgEntity, Long> {

    Boolean existsByContentidAndOriginimgurl(Long contentid, String originimgurl);
    Optional<PetPlaceImgEntity> findByContentid(Long contentid);
    List<PetPlaceImgEntity> findByPetPlaceId(Long petPlaceId);

    // Batch fetch images for multiple places to avoid N+1
    @Query("SELECT pi FROM PetPlaceImgEntity pi WHERE pi.petPlace.id IN :placeIds")
    List<PetPlaceImgEntity> findByPetPlaceIdIn(@Param("placeIds") List<Long> placeIds);
}
