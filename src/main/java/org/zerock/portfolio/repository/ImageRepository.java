package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.ImageEntity;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {
}
