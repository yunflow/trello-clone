package com.group11.trello.service.implementation;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.group11.trello.bean.Board;
import com.group11.trello.bean.Workspace;
import com.group11.trello.repository.WorkspaceRepository;
import com.group11.trello.service.BoardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
//@ExtendWith(MockitoExtension.class)
class WorkspaceImplementationTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private BoardService boardService;

    @InjectMocks
    private WorkspaceImplementation workspaceImplementation;

    private Workspace workspace;
    private Board board;

    @BeforeEach
    void setUp() {
        workspace = new Workspace();
        workspace.setWorkspaceId(1L);
        workspace.setWorkspaceName("Test Workspace");
        workspace.setWorkspaceDesc("Test Description");
        board = new Board();
        board.setBoardId(1L);
        board.setBoardName("Test Board");
    }

    @Test
    void createWorkspace() {
        when(workspaceRepository.save(any(Workspace.class))).thenReturn(workspace);
        long id = workspaceImplementation.createWorkspace(workspace);
        assertEquals(workspace.getWorkspaceId(), id);
    }

    @Test
    void findByIdNonNull() {
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        Workspace foundWorkspace = workspaceImplementation.findById(1L);
        assertNotNull(foundWorkspace);
    }

    @Test
    void findByIdReturnCorrectId() {
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        Workspace foundWorkspace = workspaceImplementation.findById(1L);
        assertEquals(workspace.getWorkspaceId(), foundWorkspace.getWorkspaceId());
    }

    @Test
    void updateDetailNonNull() {
        Workspace updatedWorkspace = new Workspace();
        updatedWorkspace.setWorkspaceId(1L);
        updatedWorkspace.setWorkspaceName("Updated Name");
        updatedWorkspace.setWorkspaceDesc("Updated Description");
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        when(workspaceRepository.save(any(Workspace.class))).thenReturn(updatedWorkspace);
        Workspace resultWorkspace = workspaceImplementation.updateDetail(updatedWorkspace);
        assertNotNull(resultWorkspace);
    }

    @Test
    void updateDetailNameCorrectly() {
        Workspace updatedWorkspace = new Workspace();
        updatedWorkspace.setWorkspaceId(1L);
        updatedWorkspace.setWorkspaceName("Updated Name");
        updatedWorkspace.setWorkspaceDesc("Updated Description");
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        when(workspaceRepository.save(any(Workspace.class))).thenReturn(updatedWorkspace);
        Workspace resultWorkspace = workspaceImplementation.updateDetail(updatedWorkspace);
        assertEquals(updatedWorkspace.getWorkspaceName(), resultWorkspace.getWorkspaceName());
    }

    @Test
    void updateDetailDescCorrectly() {
        Workspace updatedWorkspace = new Workspace();
        updatedWorkspace.setWorkspaceId(1L);
        updatedWorkspace.setWorkspaceName("Updated Name");
        updatedWorkspace.setWorkspaceDesc("Updated Description");
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        when(workspaceRepository.save(any(Workspace.class))).thenReturn(updatedWorkspace);
        Workspace resultWorkspace = workspaceImplementation.updateDetail(updatedWorkspace);
        assertEquals(updatedWorkspace.getWorkspaceDesc(), resultWorkspace.getWorkspaceDesc());
    }

    @Test
    void assignBoardNonNullWorkspace() {
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        when(boardService.findById(anyLong())).thenReturn(board);
        when(workspaceRepository.save(any(Workspace.class))).thenAnswer(i -> i.getArguments()[0]);
        Workspace resultWorkspace = workspaceImplementation.assignBoard(1L, 1L);
        assertNotNull(resultWorkspace);
    }

    @Test
    void assignBoardAddBoardToWorkspace() {
        when(workspaceRepository.findById(anyLong())).thenReturn(Optional.of(workspace));
        when(boardService.findById(anyLong())).thenReturn(board);
        when(workspaceRepository.save(any(Workspace.class))).thenAnswer(i -> i.getArguments()[0]);
        Workspace resultWorkspace = workspaceImplementation.assignBoard(1L, 1L);
        assertTrue(resultWorkspace.getBoards().contains(board));
    }
}