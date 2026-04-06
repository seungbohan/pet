package org.zerock.portfolio.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPlaceResponse {
    private Long id;
    private String title;
    private String addr1;
    private String tel;
    private double mapx;
    private double mapy;
    private String category;
    private String description;
    private String imageUrl;
    private String status;
    private String submitterName;
    private LocalDateTime regDate;
}
