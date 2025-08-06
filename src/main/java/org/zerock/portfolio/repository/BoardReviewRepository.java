package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.entity.UserEntity;

public interface BoardReviewRepository extends JpaRepository<BoardReviewEntity,Long> {
    @EntityGraph(attributePaths = {"user"}, type = EntityGraph.EntityGraphType.FETCH)
    Page<BoardReviewEntity> findByBoard_id(Long boardId, Pageable pageable);

    @Modifying
    @Query("delete from BoardReviewEntity br where br.user =: user")
    void deleteByUser(UserEntity userEntity);

    @Modifying
    @Query("delete from BoardReviewEntity r where r.board.id = :id ")
    void deleteByBoardId(Long id);
}
