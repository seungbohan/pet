package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.ReviewTagEntity;

import java.util.List;

public interface ReviewTagRepository extends JpaRepository<ReviewTagEntity, Long> {
    List<ReviewTagEntity> findByReviewId(Long reviewId);
    void deleteByReviewId(Long reviewId);
}
