package org.zerock.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PetPlaceResponse {
    private Long id;
    private Long contentid;
    private String title;
    private String addr1;
    private String tel;
    private double mapx;
    private double mapy;
    private String category;
    private String firstimage;
    private String firstimage2;
    private Double avgRating;
    private int reviewCount;
    private boolean favorited;
    private List<String> imageUrls;
}
