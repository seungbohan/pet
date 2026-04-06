package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.portfolio.entity.PlaceCategory;
import org.zerock.portfolio.entity.PetPlaceEntity;

import java.util.List;
import java.util.Optional;

public interface PetPlaceRepository extends JpaRepository<PetPlaceEntity, Long> {

    Boolean existsByContentid(Long contentid);
    Optional<PetPlaceEntity> findByContentid(Long contentid);

    Page<PetPlaceEntity> findByCategory(PlaceCategory category, Pageable pageable);

    @Query("SELECT p FROM PetPlaceEntity p WHERE p.title LIKE %:keyword% OR p.addr1 LIKE %:keyword%")
    Page<PetPlaceEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM PetPlaceEntity p WHERE (:category IS NULL OR p.category = :category) AND (p.title LIKE %:keyword% OR p.addr1 LIKE %:keyword%)")
    Page<PetPlaceEntity> searchByKeywordAndCategory(@Param("keyword") String keyword, @Param("category") PlaceCategory category, Pageable pageable);

    @Query("select p, pi, avg(coalesce(r.rating,0)), count(distinct r) from PetPlaceEntity p "
            + "left outer join PetPlaceImgEntity pi on pi.petPlace = p "
            + "left outer join PetPlaceReviewEntity r on r.petPlace = p group by p")
    Page<Object[]> getListPage(Pageable pageable);

    @Query("select p, pi, avg(coalesce(r.rating,0)), count(distinct r) from PetPlaceEntity p " +
            "left outer join PetPlaceImgEntity pi on pi.petPlace = p " +
            "left outer join PetPlaceReviewEntity r on r.petPlace = p " +
            "group by p order by count(distinct r) desc")
    Page<Object[]> getPopularListPage(Pageable pageable);

    @Query("select p, pi, avg(coalesce(r.rating,0)), count(distinct r) from PetPlaceEntity p " +
            "left outer join PetPlaceImgEntity pi on pi.petPlace = p " +
            "left outer join PetPlaceReviewEntity r on r.petPlace = p " +
            " where p.id = :id group by pi")
    List<Object[]> getPetPlaceWithReview(Long id);
}
