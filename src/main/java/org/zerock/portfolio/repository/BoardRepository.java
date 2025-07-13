package org.zerock.portfolio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ReviewEntity;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {
//    @Query("select b, bi, avg(coalesce(r.rating,0)), count(distinct r) from BoardEntity b "
//            + "left outer join ImageEntity bi on bi.board = b "
//            + "left outer join ReviewEntity r on r.board = b group by b")
//    Page<Object[]> getListPage(Pageable pageable);

    @Query("select b, bi, avg(coalesce(r.rating,0)), count(distinct r) " +
            "from BoardEntity b " +
            "left outer join ImageEntity bi on bi.board = b " +
            "left outer join ReviewEntity r on r.board = b " +
            "group by b.id, b.name, b.phoneNumber, b.location, bi.id, bi.board, bi.fileName, bi.folderPath, bi.uuid")
    Page<Object[]> getListPage(Pageable pageable);

//    @Query("select b, bi, avg(coalesce(r.rating,0)), count(distinct r) from BoardEntity b " +
//            "left outer join ImageEntity bi on bi.board = b " +
//            "left outer join ReviewEntity r on r.board = b " +
//            "group by b order by count(distinct r) desc")
//    Page<Object[]> getPopularListPage(Pageable pageable);

    @Query("select b, bi, avg(coalesce(r.rating,0)), count(distinct r) " +
            "from BoardEntity b " +
            "left outer join ImageEntity bi on bi.board = b " +
            "left outer join ReviewEntity r on r.board = b " +
            "group by b.id, b.name, b.phoneNumber, b.location, bi.id, bi.board, bi.fileName, bi.folderPath, bi.uuid " +
            "order by count(distinct r) desc")
    Page<Object[]> getPopularListPage(Pageable pageable);

    @Query("select b, bi, avg(coalesce(r.rating,0)), count(distinct r) from BoardEntity b " +
            "left outer join ImageEntity bi on bi.board = b " +
            "left outer join ReviewEntity r on r.board = b " +
            " where b.id = :id group by bi")
    List<Object[]> getBoardWithReview(Long id);
}