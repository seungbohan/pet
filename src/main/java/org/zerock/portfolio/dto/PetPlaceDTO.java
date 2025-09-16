package org.zerock.portfolio.dto;

import lombok.*;
import org.zerock.portfolio.common.ImageLike;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetPlaceDTO{

    private Long id;
    private Long contentid;
    private String contenttypeid;
    private String title;
    private String addr1;
    private String tel;
    private String type;
    private LocalDateTime modifiedtime;
    private double mapx;
    private double mapy;
    private double avg;
    private int reviewCnt;

    @Builder.Default
    private List<PetPlaceImgDTO> imageDTOList = new ArrayList<>();
}
