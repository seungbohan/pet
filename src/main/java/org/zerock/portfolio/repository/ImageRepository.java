package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.FeedEntity;
import org.zerock.portfolio.entity.ImageEntity;

import java.util.List;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    List<ImageEntity> findByFeedId(Long feedId);

    @Modifying
    @Transactional
    void deleteByFeed(FeedEntity feedEntity);

    @Modifying
    @Transactional
    @Query("delete from ImageEntity i where i.feed.user.id = :userId")
    void deleteByUserId(Long userId);
}
