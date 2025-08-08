package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.zerock.portfolio.common.ImageLike;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PetPlaceImgDTO implements ImageLike {

    private Long contentid;
    private String originimgurl;
    private String imgname;

    @Override
    public String getImageURL() {
        return originimgurl != null ? originimgurl : "";
    }

    @Override
    public String getThumbnailURL() {
        // PetPlace 이미지는 썸네일이 별도로 없으므로 원본 이미지 사용
        return originimgurl != null ? originimgurl : "";
    }
}
