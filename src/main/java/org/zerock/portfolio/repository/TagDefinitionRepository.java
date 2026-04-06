package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.TagDefinitionEntity;

public interface TagDefinitionRepository extends JpaRepository<TagDefinitionEntity, Long> {
}
