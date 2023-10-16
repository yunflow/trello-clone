package com.group11.trello.service.implementation;

import com.group11.trello.bean.Board;
import com.group11.trello.repository.BoardRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
import static org.mockito.Mockito.*;
import com.group11.trello.bean.Task;
import com.group11.trello.service.TaskService;

//@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class BoardServiceTest {

    @Mock
    BoardRepository boardRepository;
    @Mock
    TaskService taskService;

    @InjectMocks
    BoardServiceImpl boardService;

    @Test
    public void test_save_board(){

        Board board = new Board();
        board.setBoardId(1L);

        Mockito.when(boardRepository.save(board)).thenReturn(board);

        long savedBoard = boardService.saveBoard(board);

        Assertions.assertEquals(board.getBoardId(), savedBoard, "The id of the saved board should match the original board");

    }
    @Test
    public void testGetAllBoards() {
        Board board2 = new Board();
        board2.setBoardId(1L);

        Board board3 = new Board();
        board3.setBoardId(2L);

        when(boardRepository.findAll()).thenReturn(Arrays.asList(board2, board3));

        Assertions.assertEquals(2, boardService.getAllBoards().size(), "The size of the returned board list should be 2");
    }

    @Test
    public void testFindById() {
        Board board4 = new Board();
        board4.setBoardId(1L);

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board4));

        Board foundBoard = boardService.findById(1L);

        Assertions.assertEquals(board4, foundBoard, "The found board should be identical to the original board");
    }

    @Test
    public void testDeleteBoard() {
        doNothing().when(boardRepository).deleteById(1L);

        boardService.deleteBoard(1L);

        verify(boardRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testGetBoardById() {
        Board board5 = new Board();
        board5.setBoardId(1L);

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board5));

        Board foundBoard = boardService.getBoardById(1L);

        Assertions.assertEquals(board5, foundBoard, "The resulting board should be identical to the original");
    }

    @Test
    public void testAssignTask() {
        Board board6 = new Board();
        board6.setBoardId(1L);
        board6.setTasks(new ArrayList<>());


        Task task = new Task("Name", "Desc", LocalDate.now(), "status", "1");

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board6));
        when(taskService.findById(1L)).thenReturn(task);
        when(boardRepository.save(board6)).thenReturn(board6);

        Board updatedBoard = boardService.assignTask(1L, 1L);

        Assertions.assertTrue(updatedBoard.getTasks().contains(task), "The updated board should contain the assigned tasks");
    }




}
