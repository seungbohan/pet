package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoardDTO {

    private Long id;

    private String title;

    private String name;

    private String location;

    private String phoneNumber;

    private double avg;

    private int reviewCnt;
}
