package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.FeedReviewEntity;

public interface FeedReviewRepository extends JpaRepository<FeedReviewEntity, Long> {

    @EntityGraph(attributePaths = {"user"}, type = EntityGraph.EntityGraphType.FETCH)
    Page<FeedReviewEntity> findByFeed_id(Long feedId, Pageable pageable);

    @Modifying
    @Transactional
    @Query("delete from FeedReviewEntity fr where fr.user.id = :id")
    void deleteByUserId(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("delete from FeedReviewEntity r where r.feed.id = :id")
    void deleteByFeedId(@Param("id") Long id);
}
