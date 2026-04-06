package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.portfolio.entity.VoteEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.PetPlaceEntity;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<VoteEntity, Long> {
    Optional<VoteEntity> findByUserAndPetPlace(UserEntity user, PetPlaceEntity petPlace);

    @Query("SELECT COUNT(v) FROM VoteEntity v WHERE v.petPlace.id = :placeId AND v.upvote = true")
    long countUpvotes(@Param("placeId") Long placeId);

    @Query("SELECT COUNT(v) FROM VoteEntity v WHERE v.petPlace.id = :placeId AND v.upvote = false")
    long countDownvotes(@Param("placeId") Long placeId);

    void deleteByUserId(Long userId);
}
