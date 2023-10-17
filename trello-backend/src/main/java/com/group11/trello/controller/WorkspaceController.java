package com.group11.trello.controller;

import com.group11.trello.bean.Workspace;
import com.group11.trello.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Workspace controller design for front-end
 */
@RestController
@RequestMapping("/workspace")
public class WorkspaceController {
    @Autowired
    WorkspaceService workspaceService;

    /**
     * method to create a new workspace
     *
     * @param workspace the new Workspace object from user input
     * @return the new workspace ID
     */
    @PostMapping("/save")
    public long createWorkspace(@RequestBody Workspace workspace) {
        return workspaceService.createWorkspace(workspace);
    }

    /**
     * method to update a workspace name and desc
     * @param workspace Existing workspace that needs to be modified
     * @return The complete workspace object after modification
     */
    @PostMapping("/update-detail")
    public Workspace updateDetail(@RequestBody Workspace workspace) {
        return workspaceService.updateDetail(workspace);
    }

    @PutMapping("/assign-board")
    public Workspace assignBoard(@RequestParam long workspaceId, @RequestParam long boardId) {
        return workspaceService.assignBoard(workspaceId, boardId);
    }

}
