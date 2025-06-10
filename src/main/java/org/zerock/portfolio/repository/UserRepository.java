package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
