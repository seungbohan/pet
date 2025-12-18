package org.zerock.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoardDTO{

    private Long id;

    private String name;

    private Long reviewCnt;

    private String writer;

    private String writerEmail;

    private String content;

    private Long userId;

    private LocalDateTime regDate;

    private LocalDateTime modDate;

    @Builder.Default
    private List<ImageDTO> imageDTOList = new ArrayList<>();
}