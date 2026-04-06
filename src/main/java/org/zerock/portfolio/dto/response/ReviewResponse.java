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
public class ReviewResponse {
    private Long id;
    private String content;
    private int rating;
    private String writerName;
    private String writerEmail;
    private List<String> tags;
    private LocalDateTime regDate;
    private LocalDateTime modDate;
}
