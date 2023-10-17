package com.group11.trello.service;

import com.group11.trello.bean.Customer;
import com.group11.trello.bean.Task;
import org.springframework.stereotype.Service;

/**
 * Task service methods design
 */
@Service
public interface TaskService {
    Task save(Task task);

    Task createTask(Task task);

    Task updateTask(Task task);

    Task findById(long taskId);

    Customer addMember(String userName,long taskId);
}
