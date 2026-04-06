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

    @Enumerated(EnumType.STRING)
    private PlaceCategory category;
}
