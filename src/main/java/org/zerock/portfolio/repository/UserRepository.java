package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.portfolio.entity.UserEntity;
import org.zerock.portfolio.entity.UserRole;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    @Query("select u from UserEntity u where u.email = :email and u.fromSocial = :social")
    Optional<UserEntity> findByEmail(@Param("email") String email, @Param("social") boolean social);

    @EntityGraph(attributePaths = {"roleSet"}, type = EntityGraph.EntityGraphType.LOAD)
    @Query("select u from UserEntity u where u.email = :email")
    Optional<UserEntity> findByEmail(@Param("email") String email);

    boolean existsByEmail(String email);

    UserEntity findByName(String name);

    @Query("select count(u) from UserEntity u join u.roleSet r where r = :role")
    Long countByRole(@Param("role") UserRole role);
}
