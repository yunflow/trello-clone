package com.group11.trello.bean;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long boardId;

    private String boardName;


    @OneToMany(targetEntity = Task.class)
    @JoinColumn(name = "board_id")
    private List<Task> tasks;
    public Board() {
    }

    public Board(String boardName, Workspace workspace) {
        this.boardName = boardName;
    }

    public long getBoardId() {
        return boardId;
    }

    public void setBoardId(long boardId) {
        this.boardId = boardId;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String name) {
        this.boardName = name;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
