package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "pet_profile")
@Getter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "user")
public class PetProfileEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;

    private String name;
    private String species;
    private String breed;
    private int birthYear;
    private double weight;
    private String profileImageUrl;

    @Lob
    private String introduction;

    public void update(String name, String species, String breed, int birthYear, double weight, String profileImageUrl, String introduction) {
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.birthYear = birthYear;
        this.weight = weight;
        this.profileImageUrl = profileImageUrl;
        this.introduction = introduction;
    }
}
