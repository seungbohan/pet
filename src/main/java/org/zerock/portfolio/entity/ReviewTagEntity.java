package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_tag", uniqueConstraints = @UniqueConstraint(columnNames = {"review_id", "tag_id"}))
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewTagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private ReviewEntity review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private TagDefinitionEntity tag;
}
