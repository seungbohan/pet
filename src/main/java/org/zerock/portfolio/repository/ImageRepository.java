package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.FeedEntity;
import org.zerock.portfolio.entity.ImageEntity;

import java.util.List;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    List<ImageEntity> findByFeedId(Long feedId);

    // Batch fetch images for multiple feeds to avoid N+1
    @Query("SELECT i FROM ImageEntity i WHERE i.feed.id IN :feedIds")
    List<ImageEntity> findByFeedIdIn(@Param("feedIds") List<Long> feedIds);

    @Modifying
    @Transactional
    void deleteByFeed(FeedEntity feedEntity);

    @Modifying
    @Transactional
    @Query("delete from ImageEntity i where i.feed.user.id = :userId")
    void deleteByUserId(Long userId);
}
