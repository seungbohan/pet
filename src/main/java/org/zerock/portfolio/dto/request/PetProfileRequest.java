package org.zerock.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PetProfileRequest {
    @NotBlank(message = "반려동물 이름을 입력해주세요")
    private String name;
    private String species;
    private String breed;
    private int birthYear;
    private double weight;
    private String profileImageUrl;
    private String introduction;
}
