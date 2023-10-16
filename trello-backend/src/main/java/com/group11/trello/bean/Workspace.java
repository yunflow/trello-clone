package com.group11.trello.bean;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long workspaceId;

    private String workspaceName;
    private String workspaceDesc;

    @OneToMany(targetEntity = Board.class)
    @JoinColumn(name = "workspace_id")
    private List<Board> boards = new ArrayList<>();

    // Constructors, getters, and setters
    public Workspace() {
    }

    public Workspace(String workspaceName, String workspaceDesc) {
        this.workspaceName = workspaceName;
        this.workspaceDesc = workspaceDesc;
    }

    public long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }

    public String getWorkspaceDesc() {
        return workspaceDesc;
    }

    public void setWorkspaceDesc(String workspaceDesc) {
        this.workspaceDesc = workspaceDesc;
    }
}
