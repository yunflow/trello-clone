package com.group11.trello.service;

import com.group11.trello.bean.Customer;
import com.group11.trello.bean.Task;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Customer/User service methods design
 */
@Service
public interface CustomerService {

    String signUp(Customer customer);

    List<Customer> getAllCustomers();

    Customer login(Customer customer);

    Customer resetPassword(Customer customer);

    Customer assignWorkspace(long userId, long workspaceId);

    Customer findByUserName(String customer);

    List<Customer> getWorkspaceMember(long workspaceId);

    List<Customer> addMember(String userName, long workspaceId);

    Task assignMemberToTask(long workspaceId, long taskId, String userName);
}
