package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.request.ReviewRequest;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.ReviewResponse;
import org.zerock.portfolio.entity.FeedEntity;
import org.zerock.portfolio.entity.FeedReviewEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.FeedRepository;
import org.zerock.portfolio.repository.FeedReviewRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedReviewServiceImpl implements FeedReviewService {

    private final FeedReviewRepository feedReviewRepository;
    private final FeedRepository feedRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getList(Long feedId, int page) {
        PageRequest pageable = PageRequest.of(page, 5, Sort.by("id").descending());
        Page<FeedReviewEntity> result = feedReviewRepository.findByFeed_id(feedId, pageable);

        List<ReviewResponse> content = result.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<ReviewResponse>builder()
                .content(content)
                .page(page)
                .size(5)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    @Override
    public Long register(Long feedId, ReviewRequest request, String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        FeedEntity feed = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("피드를 찾을 수 없습니다."));

        FeedReviewEntity review = FeedReviewEntity.builder()
                .content(request.getContent())
                .rating(request.getRating())
                .user(user)
                .feed(feed)
                .build();

        feedReviewRepository.save(review);
        return review.getId();
    }

    @Override
    public void modify(Long id, ReviewRequest request, String email) {
        FeedReviewEntity review = feedReviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        review.changeContent(request.getContent());
    }

    @Override
    public void remove(Long id, String email) {
        FeedReviewEntity review = feedReviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        if (!review.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        feedReviewRepository.delete(review);
    }

    private ReviewResponse toResponse(FeedReviewEntity entity) {
        return ReviewResponse.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .rating(entity.getRating())
                .writerName(entity.getUser() != null ? entity.getUser().getName() : "")
                .writerEmail(entity.getUser() != null ? entity.getUser().getEmail() : "")
                .regDate(entity.getRegDate())
                .modDate(entity.getModDate())
                .build();
    }
}
