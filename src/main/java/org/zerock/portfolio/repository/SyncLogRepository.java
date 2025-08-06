package org.zerock.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.portfolio.entity.SyncLog;

import java.util.Optional;

public interface SyncLogRepository extends JpaRepository<SyncLog, String> {

    Optional<SyncLog> findTopByOperationOrderByModDateDesc(String operation);
}
