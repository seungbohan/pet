package org.zerock.portfolio.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ReviewRequest {
    @NotBlank(message = "리뷰 내용을 입력해주세요")
    @Size(max = 2000, message = "리뷰 내용은 2000자 이하로 입력해주세요")
    private String content;

    @Min(value = 1, message = "평점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "평점은 5점 이하여야 합니다")
    private int rating = 5;

    private String guestName;

    private List<Long> tagIds;
}
