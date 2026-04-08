package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "user_place")
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class UserPlaceEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private String title;
    private String addr1;
    private String tel;
    private double mapx;
    private double mapy;

    @Enumerated(EnumType.STRING)
    private PlaceCategory category;

    private String description;

    @Column(length = 2000)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PlaceStatus status = PlaceStatus.PENDING;

    public void setStatus(PlaceStatus status) {
        this.status = status;
    }
}
