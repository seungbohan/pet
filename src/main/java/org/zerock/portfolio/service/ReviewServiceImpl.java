package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.zerock.portfolio.dto.BoardDTO;
import org.zerock.portfolio.dto.PageRequestDTO;
import org.zerock.portfolio.dto.PageResultDTO;
import org.zerock.portfolio.dto.ReviewDTO;
import org.zerock.portfolio.entity.BoardEntity;
import org.zerock.portfolio.entity.ReviewEntity;
import org.zerock.portfolio.repository.BoardRepository;
import org.zerock.portfolio.repository.ImageRepository;
import org.zerock.portfolio.repository.ReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public PageResultDTO<ReviewDTO, ReviewEntity> getList(Long boardId, PageRequestDTO pageRequestDTO) {

        pageRequestDTO.setSize(5);

        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());

        Page<ReviewEntity> result = reviewRepository.findByBoard_id(boardId, pageable);

        Function<ReviewEntity, ReviewDTO> fn = (entity -> entityToDto(entity));

        return new PageResultDTO<>(result, fn);
    }

    @Override
    public Long register(ReviewDTO reviewDTO) {
        ReviewEntity reviewEntity = dtoToEntity(reviewDTO);

        reviewRepository.save(reviewEntity);
        return reviewEntity.getId();
    }

    @Override
    public void modify(ReviewDTO reviewDTO) {

        Optional<ReviewEntity> reviewEntity = reviewRepository.findById(reviewDTO.getId());

        if(reviewEntity.isPresent()) {
            ReviewEntity entity = reviewEntity.get();
            entity.changeContent(reviewDTO.getContent());
            entity.changeRating(reviewDTO.getRating());

            reviewRepository.save(entity);
        }
    }

    @Override
    public void remove(Long id) {
        reviewRepository.deleteById(id);
    }
}
