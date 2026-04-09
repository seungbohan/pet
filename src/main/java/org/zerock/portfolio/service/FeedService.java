package org.zerock.portfolio.service;

import org.zerock.portfolio.dto.request.FeedRequest;
import org.zerock.portfolio.dto.response.FeedResponse;
import org.zerock.portfolio.dto.response.PageResponse;

public interface FeedService {
    FeedResponse read(Long id);
    Long register(FeedRequest request, String email);
    void modify(Long id, FeedRequest request, String email);
    void remove(Long id, String email);
    PageResponse<FeedResponse> getList(int page, int size);
    PageResponse<FeedResponse> getPopularList(int page, int size);
    PageResponse<FeedResponse> getMyFeeds(String email, int page, int size);
    PageResponse<FeedResponse> search(String keyword, int page, int size);
}
