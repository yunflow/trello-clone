package com.group11.trello.repository;

import com.group11.trello.bean.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Workspace repository interface
 */
@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
}
