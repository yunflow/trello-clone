package com.group11.trello.controller;

import com.group11.trello.bean.Customer;
import com.group11.trello.bean.Task;
import com.group11.trello.repository.TaskRepository;
import com.group11.trello.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/save")
    public Task createTask(@RequestBody Task task) {
        // Perform any additional business logic or validation if needed
        return taskService.save(task);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@RequestBody Task updatedTask) {
        try {
            Task result = taskService.updateTask(updatedTask);
            return ResponseEntity.ok(result);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/add-member")
    public ResponseEntity<?> addMember(@RequestParam String userName, @RequestParam long taskId) {
        Customer taskMember = taskService.addMember(userName, taskId);
        if (taskMember != null) {
            return ResponseEntity.ok(taskMember);
        } else {
            System.out.println("no member found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\":\"Invalid\"}");
        }
    }
}
