package org.zerock.portfolio.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PetProfileRequest {
    @NotBlank(message = "반려동물 이름을 입력해주세요")
    @Size(max = 50, message = "이름은 50자 이하로 입력해주세요")
    private String name;

    @Size(max = 50, message = "종류는 50자 이하로 입력해주세요")
    private String species;

    @Size(max = 50, message = "품종은 50자 이하로 입력해주세요")
    private String breed;

    @Min(value = 1900, message = "출생연도는 1900년 이상이어야 합니다")
    @Max(value = 2100, message = "출생연도는 2100년 이하여야 합니다")
    private int birthYear;

    @Min(value = 0, message = "체중은 0 이상이어야 합니다")
    @Max(value = 500, message = "체중은 500kg 이하여야 합니다")
    private double weight;

    @Size(max = 500, message = "프로필 이미지 URL은 500자 이하로 입력해주세요")
    private String profileImageUrl;

    @Size(max = 500, message = "소개는 500자 이하로 입력해주세요")
    private String introduction;
}
