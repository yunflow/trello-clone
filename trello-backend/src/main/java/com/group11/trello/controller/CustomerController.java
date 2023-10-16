package com.group11.trello.controller;

import com.group11.trello.bean.Customer;
import com.group11.trello.bean.Task;
import com.group11.trello.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Customer/User controller design for front-end
 */
@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    CustomerService customerService;

    /**
     * Method when the browser sends a POST request to ".../customer/save",
     * a customer is created and stored in the database
     *
     * @param customer a new customer
     * @return Call the service's method and return a string
     */
    @PostMapping("/save")
    public String signUp(@RequestBody Customer customer) {
        return customerService.signUp(customer);
    }

    /**
     * Response method when the server sends a GET request
     *
     * @return A list containing all the user JSON stored in the database
     */
    @GetMapping("/fetch")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    /**
     * Response method when logging in at the front-end
     *
     * @param customer User-entered email and password information
     * @return Complete information about a customer or 401 if not found user
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Customer customer) {
        Customer login = customerService.login(customer);
        if (login != null) {
            return ResponseEntity.ok(login);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\":\"Invalid email or password\"}");
        }
    }

    /**
     * Change method for resetting user password
     *
     * @param customer JSON containing the email, security answer, and the new password
     * @return Complete information about the updated customer or 401 if not found user or new password is not valid
     */
    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Customer customer) {
        Customer update = customerService.resetPassword(customer);
        if (update != null) {
            return ResponseEntity.ok(update);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\":\"Invalid\"}");
        }
    }

    /**
     * This method should be called right after createWorkspace to assign the
     * created workspace to the user
     * @param userId Who will own this new workspace
     * @param workspaceId the new workspace
     * @return this user
     */
    @PutMapping("/assign-workspace")
    public Customer assignWorkspace(@RequestParam long userId, @RequestParam long workspaceId) {
        return customerService.assignWorkspace(userId, workspaceId);
    }

    /**
     * The Get request accepts a workspaceId and returns the Member of this Workspace.
     * @param workspaceId the ID of workspace
     * @return a List contains all member of that workspace
     */
    @PutMapping("/get-workspace-member")
    public List<Customer> getWorkspaceMember(@RequestParam long workspaceId) {
        return customerService.getWorkspaceMember(workspaceId);
    }

    /**
     * method is used to add members to workspace
     * @param userName New Member userName
     * @param workspaceId id of workspace
     * @return the member List of this workspace
     */
    @PutMapping("/add-member")
    public ResponseEntity<?> addMember(@RequestParam String userName, @RequestParam long workspaceId) {
        List<Customer> workspaceMember = customerService.addMember(userName, workspaceId);
        if (workspaceMember != null) {
            return ResponseEntity.ok(workspaceMember);
        } else {
            System.out.println("no member found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\":\"Invalid\"}");
        }
    }

    @PutMapping("/assign-member-to-task")
    public Task assignMemberToTask(@RequestParam long workspaceId, @RequestParam long taskId, @RequestParam String userName) {
        return customerService.assignMemberToTask(workspaceId, taskId, userName);
    }

}
