package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoardReviewDTO {

    private Long id;

    private String content;

    private String writer;

    private Long boardId;

    private String writerEmail;

    private int rating;

    private LocalDateTime regDate;

    private LocalDateTime modDate;
}
