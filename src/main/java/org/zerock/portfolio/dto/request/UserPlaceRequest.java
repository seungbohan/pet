package org.zerock.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserPlaceRequest {
    @NotBlank(message = "장소명을 입력해주세요")
    private String title;
    @NotBlank(message = "주소를 입력해주세요")
    private String addr1;
    private String tel;
    private double mapx;
    private double mapy;
    private String category;
    private String description;
    private String imageUrl;
    private java.util.List<String> imageUrls;
}
