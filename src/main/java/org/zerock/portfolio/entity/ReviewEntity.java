package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "review_type")
public abstract class ReviewEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private int rating;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;

    public void changeRating(int rating) {
        this.rating = rating;
    }

    public void changeContent(String content) {
        this.content = content;
    }
}
