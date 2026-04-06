package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetPlaceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long contentid;
    private String contenttypeid;
    private String title;
    private String addr1;
    private String tel;
    private double mapx;
    private double mapy;

    private String firstimage;    // Representative image URL
    private String firstimage2;   // Thumbnail image URL
    private String areacode;      // Area code (1=Seoul, 2=Incheon, etc.)
    private String sigungucode;   // District code
    private String zipcode;       // Zip code

    @Enumerated(EnumType.STRING)
    private PlaceCategory category;
}
