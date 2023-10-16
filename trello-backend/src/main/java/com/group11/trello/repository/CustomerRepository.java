package com.group11.trello.repository;

import com.group11.trello.bean.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Customer/User repository interface
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
