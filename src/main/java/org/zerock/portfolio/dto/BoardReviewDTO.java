package org.zerock.portfolio.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoardReviewDTO {


    private Long id;

    private String content;

    private String writer;

    private String writerEmail;

    private Long boardId;

    private LocalDateTime regDate;

    private LocalDateTime modDate;
}
