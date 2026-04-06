package org.zerock.portfolio.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ReviewRequest {
    @NotBlank(message = "리뷰 내용을 입력해주세요")
    private String content;
    @Min(1) @Max(5)
    private int rating = 5;
    private List<Long> tagIds;
}
