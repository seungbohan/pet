package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.BoardReviewDTO;
import org.zerock.portfolio.entity.BoardReviewEntity;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.BoardReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.Optional;
import java.util.function.Function;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final BoardReviewRepository boardReviewRepository;

    private final UserRepository userRepository;

    @Override
    public PageResultDTO<BoardReviewDTO, ReviewEntity> getList(Long boardId, PageRequestDTO pageRequestDTO) {

        pageRequestDTO.setSize(5);

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<BoardReviewEntity> result = boardReviewRepository.findByBoard_id(boardId, pageable);

        log.info("reviewEntity" + result.getContent());
        Function<BoardReviewEntity, BoardReviewDTO> fn = (entity -> entityToDto(entity));

        return new PageResultDTO<>(result, fn);
    }

    @Override
    public Long register(BoardReviewDTO boardReviewDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Optional<UserEntity> user = userRepository.findByEmail(email, false);

        if(!user.isPresent()) {

            log.info("user not found");

            throw new RuntimeException("Check Email or Social");
        }

        ReviewEntity reviewEntity = dtoToEntity(boardReviewDTO);
        reviewEntity.setUser(user.get());

        boardReviewRepository.save(reviewEntity);
        return reviewEntity.getId();
    }

    @Override
    public void modify(BoardReviewDTO boardReviewDTO) {

        Optional<ReviewEntity> reviewEntity = boardReviewRepository.findById(boardReviewDTO.getId());

        if(reviewEntity.isPresent()) {
            ReviewEntity entity = reviewEntity.get();
            entity.changeContent(boardReviewDTO.getContent());
            entity.changeRating(boardReviewDTO.getRating());

            boardReviewRepository.save(entity);
        }
    }

    @Override
    public void remove(Long id) {
        boardReviewRepository.deleteById(id);
    }
}
