package com.group11.trello.controller;

import com.group11.trello.bean.Board;
import com.group11.trello.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board")
public class BoardController {
    @Autowired
    private BoardService boardService;

    @PostMapping("/save")
    public long saveBoard(@RequestBody Board board) {
        return boardService.saveBoard(board);
    }

    @GetMapping("/fetch")
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    // Other endpoints and functionalities
    @DeleteMapping("/delete-board")
    public String deleteBoard(@RequestParam long boardId) {
        boardService.deleteBoard(boardId);
        return "Successfully deleted Board!";
    }

    @PutMapping("/find-board")
    public Board getBoard(@RequestParam long boardId) {
        return boardService.getBoardById(boardId);
    }

    @PutMapping("/assign-task")
    public Board assignTask(@RequestParam long boardId, @RequestParam long taskId) {
        return boardService.assignTask(boardId, taskId);
    }
}
