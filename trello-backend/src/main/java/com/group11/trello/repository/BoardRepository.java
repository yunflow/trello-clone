package com.group11.trello.repository;

import com.group11.trello.bean.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // Additional custom query methods or operations can be defined here
}
