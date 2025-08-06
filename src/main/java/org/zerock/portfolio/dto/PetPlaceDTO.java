package org.zerock.portfolio.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetPlaceDTO {

    private Long contentid;
    private String contenttypeid;
    private String title;
    private String addr1;
    private String tel;
    private LocalDateTime modifiedtime;
    private double mapx;
    private double mapy;


    @Builder.Default
    private List<PetPlaceImgDTO> imageDTOList = new ArrayList<>();
}
