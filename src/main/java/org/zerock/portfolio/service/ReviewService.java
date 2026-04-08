package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.request.ReviewRequest;

/**
 * Unified review service that dispatches to the correct review type
 * (feed review or place review) without using exception-based control flow.
 */
public interface ReviewService {
    void modify(Long id, ReviewRequest request, String email);
    void remove(Long id, String email);
}
