package org.zerock.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tag_definition")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TagDefinitionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String icon;
}
