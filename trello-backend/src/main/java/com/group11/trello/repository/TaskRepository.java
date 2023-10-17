package com.group11.trello.repository;

import com.group11.trello.bean.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Additional custom query methods or operations can be defined here
}
