package com.group11.trello.service.implementation;

import com.group11.trello.bean.Task;
import com.group11.trello.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TaskServiceTest {

    @InjectMocks
    TaskImpl taskService;
    @Mock
    TaskRepository taskRepository;

    @Test
    public void test_create_valid_task() {
        Task task = new Task();
        task.setTaskName("Task 1");
        task.setTaskDesc("This task is all about backend");
        task.setDueDate(LocalDate.now());

        when(this.taskRepository.save(task)).thenReturn(task);

        Task savedTask = this.taskService.createTask(task);

        assertEquals(task.getTaskName(), savedTask.getTaskName());

        verify(this.taskRepository).save(task);

    }

    @Test
    public void test_create_task_with_invalid_due_date() {
        Task task = new Task();
        task.setTaskName("Task 1");
        task.setTaskDesc("This task is all about backend");
        task.setDueDate(LocalDate.of(2022, 1, 1));


        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> {this.taskService.createTask(task);}
        );

        assertEquals("Invalid due date", exception.getReason());

    }

    @Test
    public void test_create_task_with_a_missing_name() {
        Task task = new Task();
        task.setTaskDesc("This task is all about backend");
        task.setDueDate(LocalDate.of(2023, 12, 1));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> { this.taskService.createTask(task); }
        );

        assertEquals("Missing task name", exception.getReason());
    }

    @Test
    public void testUpdateTask_ValidDetails(){

        long id = 1L;

        Task task1 = new Task();
        task1.setTaskId(id);
        task1.setTaskName("Task name");
        task1.setTaskDesc("This is task 1");
        task1.setDueDate(LocalDate.of(2023,11,17));
        task1.setStatus("TODO");

        Task task2 = new Task();
        task2.setTaskId(id);
        task2.setTaskName("Task name");
        task2.setTaskDesc("This is task 1");
        task2.setDueDate(LocalDate.of(2023,11,28));
        task2.setStatus("TODO");

        when(this.taskRepository.findById(id)).thenReturn(Optional.of(task1));
        when(this.taskRepository.save(any(Task.class))).thenReturn(task2);

        this.taskService.updateTask(task2);

        LocalDate dueDate = task1.getDueDate();
        LocalDate updatedDueDate = task2.getDueDate();

        assertEquals(dueDate, updatedDueDate);
    }

    @Test
    public void testUpdateTask_InvalidStatus_Failure() {

        long taskId = 1L;

        Task task1 = new Task();
        task1.setTaskId(taskId);
        task1.setTaskName("Task name");
        task1.setTaskDesc("This is task 1");
        task1.setDueDate(LocalDate.of(2023, 11, 17));
        task1.setStatus("TODO");

        Task task2 = new Task();
        task2.setTaskId(taskId);
        task2.setTaskName("Task name");
        task2.setTaskDesc("This is task 1");
        task2.setDueDate(LocalDate.of(2023, 11, 28));
        task2.setStatus("Invalid Status");

        when(this.taskRepository.findById(taskId)).thenReturn(Optional.of(task1));

        assertThrows(ResponseStatusException.class, () -> {
            this.taskService.updateTask(task2);
        });
        verify(this.taskRepository, never()).save(any(Task.class));
    }

    @Test
    public void testUpdateTask_NonExistentTaskId_Failure() {

        long nonExistentTaskId = 100L;

        Task updatedTask = new Task();
        updatedTask.setTaskId(nonExistentTaskId);
        updatedTask.setTaskName("Updated Task name");
        updatedTask.setTaskDesc("Updated description");
        updatedTask.setDueDate(LocalDate.of(2023, 11, 28));
        updatedTask.setStatus("TODO");

        when(this.taskRepository.findById(nonExistentTaskId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            this.taskService.updateTask(updatedTask);
        });
        verify(this.taskRepository, times(1)).findById(nonExistentTaskId);
        verify(this.taskRepository, never()).save(any(Task.class));
    }

}
