package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.entity.UserEntity;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity,Long> {
    @EntityGraph(attributePaths = {"user"}, type = EntityGraph.EntityGraphType.FETCH)
    Page<ReviewEntity> findByBoard_id(Long boardId, Pageable pageable);

    @Modifying
    @Query("delete from ReviewEntity br where br.user =: user")
    void deleteByUser(UserEntity userEntity);

    @Modifying
    @Query("delete from ReviewEntity r where r.board.id = :id ")
    void deleteByBoardId(Long id);
}
