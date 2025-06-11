package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoardDTO {

    private Long id;

    private String name;

    private String location;

    private String phoneNumber;

    private double avg;

    private int reviewCnt;

    @Builder.Default
    private List<ImageDTO> imageDTOList = new ArrayList<>();
}
