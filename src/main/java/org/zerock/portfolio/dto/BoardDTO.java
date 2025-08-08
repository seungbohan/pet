package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerock.portfolio.common.BoardLike;
import org.zerock.portfolio.common.ImageLike;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BoardDTO implements BoardLike {

    private Long id;

    private String name;

    private String location;

    private String phoneNumber;

    private String type;

    private double avg;

    private Long reviewCnt;

    @Builder.Default
    private List<ImageDTO> imageDTOList = new ArrayList<>();

    @Override
    public String getType() {
        return "board";
    }

    @Override
    public List<? extends ImageLike> getImages() {
        return imageDTOList;
    }
}
