package org.zerock.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BizDTO {

    private Long id;
    private String email;
    private String password;
    private String name;
    private String bizName;
    private String phoneNumber;
    private String location;
}
