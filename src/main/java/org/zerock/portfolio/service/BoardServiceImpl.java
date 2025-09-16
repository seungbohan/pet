package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.*;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ImageEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.BoardRepository;
import org.zerock.portfolio.repository.ImageRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.*;
import java.util.function.Function;

@Service
@Log4j2
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    @Override
    public BoardDTO read(Long id) {
        List<Object[]> result = boardRepository.getBoardWithReview(id);

        BoardEntity boardEntity = (BoardEntity) result.get(0)[0];
        List<ImageEntity> imageList = new ArrayList<>();
        result.forEach(arr -> {
            ImageEntity imageEntity = (ImageEntity) arr[1];
            imageList.add(imageEntity);
        });
        Long reviewCnt = (Long) result.get(0)[2];

        return entitiesToDto(boardEntity, imageList, reviewCnt);
    }

    @Override
    public Long register(BoardDTO boardDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Optional<UserEntity> user = userRepository.findByEmail(email , false);

        if (!user.isPresent()) {

            log.info("user not found");

            throw new RuntimeException("Check Email or Social");
        }

        Map<String ,Object> entityMap = dtoToEntity(boardDTO);

        BoardEntity boardEntity = (BoardEntity) entityMap.get("board");

        List<ImageEntity> imageList = (List<ImageEntity>) entityMap.get("imageList");
        if (imageList == null) {
            imageList = List.of();
        }

        boardEntity.setUser(user.get());

        boardRepository.save(boardEntity);

        imageList.forEach(imageEntity -> imageRepository.save(imageEntity));

        return boardEntity.getId();
    }

    @Override
    public PageResultDTO<BoardDTO, Object[]> getList(PageRequestDTO pageRequestDTO) {

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<Object[]> result = boardRepository.getListPage(pageable);

        Function<Object[], BoardDTO> fn = (arr -> entitiesToDto(
                (BoardEntity) arr[0],
                (List<ImageEntity>)(Arrays.asList((ImageEntity) arr[1])),
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
                (List<ImageEntity>)(Arrays.asList((ImageEntity) arr[1])),
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
                (List<ImageEntity>)(Arrays.asList((ImageEntity) arr[1])),
                (Long) arr[2]
        ));

        return new MainPageResultDTO<>(recent, popular, fn);
    }
}
