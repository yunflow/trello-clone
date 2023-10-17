package com.group11.trello.service;

import com.group11.trello.bean.Workspace;
import org.springframework.stereotype.Service;

/**
 * Workspace service methods design
 */
@Service
public interface WorkspaceService {
    long createWorkspace(Workspace workspace);

    Workspace findById(long workspaceId);

    Workspace updateDetail(Workspace workspace);

    Workspace assignBoard(long workspaceId, long boardId);

}
