package com.group11.trello.service.implementation;

import com.group11.trello.bean.Board;
import com.group11.trello.bean.Workspace;
import com.group11.trello.repository.BoardRepository;
import com.group11.trello.service.BoardService;
import com.group11.trello.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoardServiceImpl implements BoardService {
    @Autowired
    BoardRepository boardRepository;

    @Autowired
    TaskService taskService;

    @Override
    public long saveBoard(Board board) {
        boardRepository.save(board);
        return board.getBoardId();
    }

    @Override
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    @Override
    public Board findById(long boardId) {
        Optional<Board> optionalBoard = boardRepository.findById(boardId);
        return optionalBoard.orElse(null);
    }

    @Override
    public void deleteBoard(long boardId) {
        boardRepository.deleteById(boardId);
    }

    @Override
    public Board getBoardById(long boardId) {
        Optional<Board> optionalBoard = boardRepository.findById(boardId);
        return optionalBoard.orElse(null);
    }

    @Override
    public Board assignTask(long boardId, long taskId) {
        Board board = findById(boardId);
        board.getTasks().add(taskService.findById(taskId));
        return boardRepository.save(board);
    }

    // Implement other methods of BoardService if needed
}
