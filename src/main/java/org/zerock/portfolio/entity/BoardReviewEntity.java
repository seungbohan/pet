package org.zerock.portfolio.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"board", "user"})
@DiscriminatorValue("BOARD")
public class BoardReviewEntity extends ReviewEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    private BoardEntity board;

}
