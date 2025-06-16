package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.portfolio.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @EntityGraph(attributePaths = {"roleSetg"}, type = EntityGraph.EntityGraphType.LOAD)
    @Query("select u from UserEntity u where u.fromSocial = :social and u.email =: email")
    Optional<UserEntity> findByEmail(String email, boolean social);
}
