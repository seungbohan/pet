package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "petPlace")
public class PetPlaceImgEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long contentid;
    private String originimgurl;
    private String imgname;

    @ManyToOne(fetch = FetchType.LAZY)
    private PetPlaceEntity petPlace;
}
