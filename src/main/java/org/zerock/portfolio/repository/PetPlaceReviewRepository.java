package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.PetPlaceReviewEntity;
import org.zerock.portfolio.entity.UserEntity;

public interface PetPlaceReviewRepository extends JpaRepository<PetPlaceReviewEntity, Long> {
    @EntityGraph(attributePaths = {"user"}, type = EntityGraph.EntityGraphType.FETCH)
    Page<PetPlaceReviewEntity> findByPetPlace_id(Long petPlaceId, Pageable pageable);

    @Modifying
    @Query("delete from PetPlaceReviewEntity pr where pr.user = :user")
    void deleteByUser(UserEntity userEntity);

    @Modifying
    @Query("delete from PetPlaceReviewEntity r where r.petPlace.id = :id ")
    void deleteByPetPlaceId(Long id);
}
