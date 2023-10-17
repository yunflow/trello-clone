package com.group11.trello.service;

import com.group11.trello.bean.Board;

import java.util.List;

public interface BoardService {
    long saveBoard(Board board);
    List<Board> getAllBoards();

    Board findById(long boardId);

    void deleteBoard(long boardId);

    Board getBoardById(long boardId);

    Board assignTask(long boardId, long taskId);

    // Other service methods
}
