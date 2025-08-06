package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PetPlaceImgDTO {

    private Long contentid;
    private String originimgurl;
    private String imgname;
}
