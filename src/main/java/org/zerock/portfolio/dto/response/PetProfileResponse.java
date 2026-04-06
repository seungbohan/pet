package org.zerock.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PetProfileResponse {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private int birthYear;
    private double weight;
    private String profileImageUrl;
    private String introduction;
    private LocalDateTime regDate;
    private LocalDateTime modDate;
}
