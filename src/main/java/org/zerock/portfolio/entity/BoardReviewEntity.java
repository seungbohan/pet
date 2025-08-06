package org.zerock.portfolio.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.ToString;

@Entity
@Getter
@ToString(exclude = {"petPlace", "user"})
@DiscriminatorValue("BOARD")
public class BoardReviewEntity extends ReviewEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    private BoardEntity board;

}
