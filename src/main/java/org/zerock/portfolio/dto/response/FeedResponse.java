package org.zerock.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedResponse {
    private Long id;
    private String title;
    private String content;
    private String writerName;
    private String writerEmail;
    private Long writerId;
    private int reviewCount;
    private int likeCount;
    private List<ImageInfo> images;
    private LocalDateTime regDate;
    private LocalDateTime modDate;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageInfo {
        private String imageURL;
        private String thumbnailURL;
    }
}
