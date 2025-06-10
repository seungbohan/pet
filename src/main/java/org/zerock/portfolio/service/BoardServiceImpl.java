package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.MainPageResultDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.repository.BoardRepository;
import org.zerock.portfolio.repository.ImageRepository;
import org.zerock.portfolio.repository.ReviewRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
@Log4j2
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    @Override
    public Long register(BoardDTO boardDTO) {

        BoardEntity boardEntity = dtoToEntity(boardDTO);

        boardRepository.save(boardEntity);

        return boardEntity.getId();
    }

    @Override
    public BoardDTO read(Long id) {
        List<Object[]> result = boardRepository.getBoardWithReview(id);

        BoardEntity boardEntity = (BoardEntity) result.get(0)[0];
        Double avg = (Double) result.get(0)[1];
        Long reviewCnt = (Long) result.get(0)[2];

        return entitiesToDto(boardEntity, avg, reviewCnt);

    }

    @Override
    public PageResultDTO<BoardDTO, Object[]> getList(PageRequestDTO pageRequestDTO) {

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<Object[]> result = boardRepository.getListPage(pageable);

        Function<Object[], BoardDTO> fn = (arr -> entitiesToDto(
                (BoardEntity) arr[0],
                (Double) arr[1],
                (Long) arr[2]
        ));

        return new PageResultDTO<>(result, fn);
    }

    @Override
    public PageResultDTO<BoardDTO, Object[]> getPopularList(PageRequestDTO pageRequestDTO) {

        Pageable pageable = pageRequestDTO.getPageable(Sort.unsorted());

        Page<Object[]> result = boardRepository.getPopularListPage(pageable);

        Function<Object[], BoardDTO> fn = (arr -> entitiesToDto(
                (BoardEntity) arr[0],
                (Double) arr[1],
                (Long) arr[2]
        ));

        return new PageResultDTO<>(result, fn);
    }


    @Override
    public MainPageResultDTO<BoardDTO, Object[]> getMainRecentList(PageRequestDTO pageRequestDTO) {
        Pageable recentPageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        // 인기 게시글은 정렬 제거하고 내부 쿼리에서 정렬함
        Pageable popularPageable = pageRequestDTO.getPageable(Sort.unsorted());

        Page<Object[]> recent = boardRepository.getListPage(recentPageable);
        Page<Object[]> popular = boardRepository.getPopularListPage(popularPageable);

        Function<Object[], BoardDTO> fn = (arr -> entitiesToDto(
                (BoardEntity) arr[0],
                (Double) arr[1],
                (Long) arr[2]
        ));

        return new MainPageResultDTO<>(recent, popular, fn);
    }
}
