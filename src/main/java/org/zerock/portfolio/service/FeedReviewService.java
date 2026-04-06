package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.request.ReviewRequest;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.dto.response.ReviewResponse;

public interface FeedReviewService {
    PageResponse<ReviewResponse> getList(Long feedId, int page);
    Long register(Long feedId, ReviewRequest request, String email);
    void modify(Long id, ReviewRequest request, String email);
    void remove(Long id, String email);
}
