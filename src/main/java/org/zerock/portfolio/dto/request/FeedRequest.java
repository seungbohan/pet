package org.zerock.portfolio.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class FeedRequest {
    @NotBlank(message = "제목을 입력해주세요")
    @Size(max = 200, message = "제목은 200자 이하로 입력해주세요")
    private String title;

    @NotBlank(message = "내용을 입력해주세요")
    @Size(max = 10000, message = "내용은 10000자 이하로 입력해주세요")
    private String content;

    @Valid
    @Size(max = 10, message = "이미지는 최대 10개까지 가능합니다")
    private List<ImageData> images;

    @Data
    public static class ImageData {
        @NotBlank(message = "파일명은 필수입니다")
        @Size(max = 255, message = "파일명이 너무 깁니다")
        // [SECURITY] Path Traversal 방어 - ".." 및 경로 구분자 차단
        @Pattern(regexp = "^[a-zA-Z0-9가-힣._-]+$", message = "유효하지 않은 파일명입니다")
        private String fileName;

        @NotBlank(message = "UUID는 필수입니다")
        // [SECURITY] UUID 형식 검증
        @Pattern(regexp = "^[a-fA-F0-9-]{36}$", message = "유효하지 않은 UUID입니다")
        private String uuid;

        @NotBlank(message = "폴더 경로는 필수입니다")
        // [SECURITY] 폴더 경로는 yyyy/MM/dd 형식만 허용
        @Pattern(regexp = "^\\d{4}/\\d{2}/\\d{2}$", message = "유효하지 않은 폴더 경로입니다")
        private String folderPath;
    }
}
