package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString(exclude = "board")
public class ImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String fileName;

    private String folderPath;

    private String uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    private BoardEntity board;
}
