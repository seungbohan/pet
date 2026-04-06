package org.zerock.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.portfolio.dto.request.FeedRequest;
import org.zerock.portfolio.dto.response.FeedResponse;
import org.zerock.portfolio.dto.response.PageResponse;
import org.zerock.portfolio.entity.FeedEntity;
import org.zerock.portfolio.entity.ImageEntity;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.repository.FeedRepository;
import org.zerock.portfolio.repository.FeedReviewRepository;
import org.zerock.portfolio.repository.ImageRepository;
import org.zerock.portfolio.repository.UserRepository;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class FeedServiceImpl implements FeedService {

    private final FeedRepository feedRepository;
    private final ImageRepository imageRepository;
    private final FeedReviewRepository feedReviewRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public FeedResponse read(Long id) {
        List<Object[]> result = feedRepository.getFeedWithReview(id);
        if (result == null || result.isEmpty()) {
            throw new IllegalArgumentException("피드를 찾을 수 없습니다.");
        }

        Object[] firstRow = result.get(0);
        FeedEntity feed = (FeedEntity) firstRow[0];
        List<ImageEntity> images = imageRepository.findByFeedId(feed.getId());
        long reviewCount = (long) firstRow[2];

        return toResponse(feed, images, reviewCount);
    }

    @Override
    public Long register(FeedRequest request, String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        FeedEntity feed = FeedEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .build();

        feedRepository.save(feed);

        if (request.getImages() != null) {
            for (FeedRequest.ImageData img : request.getImages()) {
                ImageEntity image = ImageEntity.builder()
                        .fileName(img.getFileName())
                        .uuid(img.getUuid())
                        .folderPath(img.getFolderPath())
                        .feed(feed)
                        .build();
                imageRepository.save(image);
            }
        }

        return feed.getId();
    }

    @Override
    public void modify(Long id, FeedRequest request, String email) {
        FeedEntity feed = feedRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("피드를 찾을 수 없습니다."));

        if (!feed.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        feed.changeTitle(request.getTitle());
        feed.changeContent(request.getContent());

        imageRepository.deleteByFeed(feed);
        if (request.getImages() != null) {
            for (FeedRequest.ImageData img : request.getImages()) {
                ImageEntity image = ImageEntity.builder()
                        .fileName(img.getFileName())
                        .uuid(img.getUuid())
                        .folderPath(img.getFolderPath())
                        .feed(feed)
                        .build();
                imageRepository.save(image);
            }
        }
    }

    @Override
    public void remove(Long id, String email) {
        FeedEntity feed = feedRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("피드를 찾을 수 없습니다."));

        if (!feed.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        feedReviewRepository.deleteByFeedId(id);
        imageRepository.deleteByFeed(feed);
        feedRepository.delete(feed);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FeedResponse> getList(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Object[]> result = feedRepository.getListPage(pageable);
        return toPageResponse(result, page, size);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FeedResponse> getPopularList(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Object[]> result = feedRepository.getPopularListPage(pageable);
        return toPageResponse(result, page, size);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FeedResponse> getMyFeeds(String email, int page, int size) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        PageRequest pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<FeedEntity> feeds = feedRepository.findByUserId(user.getId(), pageable);

        List<FeedResponse> content = feeds.getContent().stream()
                .map(f -> toResponse(f, List.of(), 0L))
                .collect(Collectors.toList());

        return PageResponse.<FeedResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(feeds.getTotalElements())
                .totalPages(feeds.getTotalPages())
                .first(feeds.isFirst())
                .last(feeds.isLast())
                .build();
    }

    private PageResponse<FeedResponse> toPageResponse(Page<Object[]> result, int page, int size) {
        List<FeedResponse> content = result.getContent().stream()
                .map(row -> {
                    FeedEntity feed = (FeedEntity) row[0];
                    List<ImageEntity> images = row.length > 1 && row[1] instanceof ImageEntity
                        ? List.of((ImageEntity) row[1]) : List.of();
                    long reviewCount = row.length > 2 ? ((Number) row[row.length - 1]).longValue() : 0L;
                    return toResponse(feed, images, reviewCount);
                })
                .collect(Collectors.toList());

        return PageResponse.<FeedResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    private FeedResponse toResponse(FeedEntity feed, List<ImageEntity> images, long reviewCount) {
        List<FeedResponse.ImageInfo> imageInfos = images.stream()
                .map(img -> {
                    String path = img.getFolderPath() + "/" + img.getUuid() + "_" + img.getFileName();
                    String thumbPath = img.getFolderPath() + "/s_" + img.getUuid() + "_" + img.getFileName();
                    try {
                        return FeedResponse.ImageInfo.builder()
                                .imageURL(URLEncoder.encode(path, "UTF-8"))
                                .thumbnailURL(URLEncoder.encode(thumbPath, "UTF-8"))
                                .build();
                    } catch (UnsupportedEncodingException e) {
                        return FeedResponse.ImageInfo.builder()
                                .imageURL(path)
                                .thumbnailURL(thumbPath)
                                .build();
                    }
                })
                .collect(Collectors.toList());

        return FeedResponse.builder()
                .id(feed.getId())
                .title(feed.getTitle())
                .content(feed.getContent())
                .writerName(feed.getUser() != null ? feed.getUser().getName() : "")
                .writerEmail(feed.getUser() != null ? feed.getUser().getEmail() : "")
                .writerId(feed.getUser() != null ? feed.getUser().getId() : null)
                .reviewCount((int) reviewCount)
                .likeCount(feed.getLikeCount())
                .images(imageInfos)
                .regDate(feed.getRegDate())
                .modDate(feed.getModDate())
                .build();
    }
}
