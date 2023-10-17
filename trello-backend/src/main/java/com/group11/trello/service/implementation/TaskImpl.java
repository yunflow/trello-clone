package com.group11.trello.service.implementation;

import com.group11.trello.bean.Customer;
import com.group11.trello.bean.Task;
import com.group11.trello.repository.TaskRepository;
import com.group11.trello.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Task service methods implementation
 */
@Service
public class TaskImpl implements TaskService {

    @Autowired
    TaskRepository taskRepository;


    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task createTask(Task task) throws ResponseStatusException
    {
        // Validate the task name
        if (task.getTaskName() == null || task.getTaskName().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing task name");
        }

        if (task.getDueDate() != null && task.getDueDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid due date");
        }
        return this.taskRepository.save(task);
    }

    public Task findById(long taskId) {
        Optional<Task> task = taskRepository.findById(taskId);
        return task.orElse(null);
    }

    @Override
    public Task updateTask(Task task){
        long taskId = task.getTaskId();

        // Check if the task with the given taskId exists in the repository
        Optional<Task> optionalTask = taskRepository.findById(taskId);

        String notFoundMessage = "Task with ID " + taskId + " not found.";
        ResponseStatusException exception = new ResponseStatusException(HttpStatus.NOT_FOUND, notFoundMessage);
        Task existingTask = optionalTask.orElseThrow(() -> exception);

        // Validate the status of the updated task (e.g., check if it's a valid status)
        String updatedStatus = task.getStatus();
        if (!isValidStatus(updatedStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid task status");
        }

        existingTask.setTaskName(task.getTaskName());
        existingTask.setTaskDesc(task.getTaskDesc());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setStatus(updatedStatus);

        return taskRepository.save(existingTask);
    }

    private boolean isValidStatus(String status) {

        String[] validStatuses = {"TODO", "IN_PROGRESS", "DONE"};

        // Check if the provided status is in the list of valid statuses
        for (String validStatus : validStatuses) {
            if (validStatus.equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
    @Override
    public Customer addMember(String userName,long taskId) {
        return null;
    }
}
