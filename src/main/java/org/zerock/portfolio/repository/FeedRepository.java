package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.FeedEntity;

import java.util.List;

public interface FeedRepository extends JpaRepository<FeedEntity, Long> {

    @Query("select f, fi, count(distinct r) from FeedEntity f "
            + "left outer join ImageEntity fi on fi.feed = f "
            + "left outer join FeedReviewEntity r on r.feed = f group by f")
    Page<Object[]> getListPage(Pageable pageable);

    @Query("select f, fi, count(distinct r) from FeedEntity f " +
            "left outer join ImageEntity fi on fi.feed = f " +
            "left outer join FeedReviewEntity r on r.feed = f " +
            "group by f order by count(distinct r) desc")
    Page<Object[]> getPopularListPage(Pageable pageable);

    @Query("select f, fi, count(distinct r) from FeedEntity f " +
            "left outer join ImageEntity fi on fi.feed = f " +
            "left outer join FeedReviewEntity r on r.feed = f " +
            " where f.id = :id group by fi")
    List<Object[]> getFeedWithReview(Long id);

    @Modifying
    @Transactional
    @Query("delete from FeedEntity f where f.user.id = :id")
    void deleteByUserId(@Param("id") Long id);

    List<FeedEntity> findByUserId(Long id);

    Page<FeedEntity> findByUserId(Long userId, Pageable pageable);

    @Query("select f, fi, count(distinct r) from FeedEntity f "
            + "left outer join ImageEntity fi on fi.feed = f "
            + "left outer join FeedReviewEntity r on r.feed = f "
            + "where lower(f.title) like lower(concat('%', :keyword, '%')) "
            + "or cast(f.content as string) like concat('%', :keyword, '%') "
            + "group by f")
    Page<Object[]> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
