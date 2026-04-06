package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "vote", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "pet_place_id"}))
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class VoteEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_place_id")
    private PetPlaceEntity petPlace;

    private boolean upvote; // true = 추천, false = 비추천

    public void changeVote(boolean upvote) {
        this.upvote = upvote;
    }
}
