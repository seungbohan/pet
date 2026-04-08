package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.request.ReviewRequest;
import org.zerock.portfolio.repository.FeedReviewRepository;
import org.zerock.portfolio.repository.PetPlaceReviewRepository;

/**
 * Determines the review type by checking repository existence first,
 * then delegates to the appropriate typed service.
 * This replaces the try-catch anti-pattern that used exceptions for control flow.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

    private final FeedReviewRepository feedReviewRepository;
    private final PetPlaceReviewRepository petPlaceReviewRepository;
    private final FeedReviewService feedReviewService;
    private final PetPlaceReviewService petPlaceReviewService;

    @Override
    @Transactional
    public void modify(Long id, ReviewRequest request, String email) {
        if (feedReviewRepository.existsById(id)) {
            feedReviewService.modify(id, request, email);
        } else if (petPlaceReviewRepository.existsById(id)) {
            petPlaceReviewService.modifyWithResponse(id, request, email);
        } else {
            throw new IllegalArgumentException("리뷰를 찾을 수 없습니다. id=" + id);
        }
    }

    @Override
    @Transactional
    public void remove(Long id, String email) {
        if (feedReviewRepository.existsById(id)) {
            feedReviewService.remove(id, email);
        } else if (petPlaceReviewRepository.existsById(id)) {
            petPlaceReviewService.removeWithResponse(id, email);
        } else {
            throw new IllegalArgumentException("리뷰를 찾을 수 없습니다. id=" + id);
        }
    }
}
