package com.group11.trello.service.implementation;

import com.group11.trello.bean.Workspace;
import com.group11.trello.repository.WorkspaceRepository;
import com.group11.trello.service.BoardService;
import com.group11.trello.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Workspace service methods implementation
 */
@Service
public class WorkspaceImplementation implements WorkspaceService {
    @Autowired
    WorkspaceRepository workspaceRepository;
    @Autowired
    BoardService boardService;

    @Override
    public long createWorkspace(Workspace workspace) {
        workspaceRepository.save(workspace);
        return workspace.getWorkspaceId();
    }

    @Override
    public Workspace findById(long workspaceId) {
        Optional<Workspace> workspace = workspaceRepository.findById(workspaceId);
        return workspace.orElse(null);
    }

    @Override
    public Workspace updateDetail(Workspace workspace) {
        Workspace update = findById(workspace.getWorkspaceId());
        update.setWorkspaceName(workspace.getWorkspaceName());
        update.setWorkspaceDesc(workspace.getWorkspaceDesc());
        return workspaceRepository.save(update);
    }

    @Override
    public Workspace assignBoard(long workspaceId, long boardId) {
        Workspace workspace = findById(workspaceId);
        workspace.getBoards().add(boardService.findById(boardId));
        return workspaceRepository.save(workspace);
    }

}
