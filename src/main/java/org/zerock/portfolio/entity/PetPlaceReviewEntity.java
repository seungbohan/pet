package org.zerock.portfolio.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.ToString;

@Entity
@ToString(exclude = {"petPlace", "user"})
@DiscriminatorValue("PETPLACE")
public class PetPlaceReviewEntity extends ReviewEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    private PetPlaceEntity petPlace;
}
