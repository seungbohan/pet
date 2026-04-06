package org.zerock.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class FeedRequest {
    @NotBlank(message = "제목을 입력해주세요")
    private String title;
    @NotBlank(message = "내용을 입력해주세요")
    private String content;
    private List<ImageData> images;

    @Data
    public static class ImageData {
        private String fileName;
        private String uuid;
        private String folderPath;
    }
}
