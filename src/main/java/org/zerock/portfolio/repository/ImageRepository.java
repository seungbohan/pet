package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    @Modifying
    @Transactional
    void deleteByBoard(BoardEntity boardEntity);

    @Modifying
    @Transactional
    @Query("delete from ImageEntity i where i.board.user.id = :userId")
    void deleteByUserId(Long userId);

}
