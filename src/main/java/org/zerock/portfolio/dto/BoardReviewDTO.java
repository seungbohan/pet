package org.zerock.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime regDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime modDate;
}
