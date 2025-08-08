package org.zerock.portfolio.dto;

import lombok.*;
import org.zerock.portfolio.common.BoardLike;
import org.zerock.portfolio.common.ImageLike;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetPlaceDTO implements BoardLike {

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

    @Override
    public String getName() {
        return title;
    }

    @Override
    public String getLocation() {
        return addr1;
    }

    @Override
    public String getPhoneNumber() {
        return tel;
    }

    @Override
    public String getType() {
        return "petplace";
    }

    @Override
    public List<? extends ImageLike> getImages() {
        return imageDTOList;
    }
}
