package com.group11.trello.service.implementation;

import com.group11.trello.bean.Customer;

import com.group11.trello.bean.Task;
import com.group11.trello.bean.Workspace;
import com.group11.trello.repository.CustomerRepository;
import com.group11.trello.service.TaskService;
import com.group11.trello.service.WorkspaceService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test cases for Customer Service
 */

@SpringBootTest
//@ExtendWith(MockitoExtension.class)

public class CustomerImplementationTest {
    CustomerImplementation cI = new CustomerImplementation();

    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private WorkspaceService workspaceService;

    @Mock
    private TaskService taskService;

    @InjectMocks
    private CustomerImplementation customerService;
    /**
     * Test the password string for matching the requirements
     */

    @Test
    public void test_is_password_invalid_length_short() {
        String p1 = "12345";
        assertFalse(cI.isValid(p1));
    }

    @Test
    public void test_is_password_invalid_no_uppercase() {
        String p2 = "12345678";
        assertFalse(cI.isValid(p2));
    }

    @Test
    public void test_is_password_invalid_no_special_char() {
        String p3 = "aa123456";
        assertFalse(cI.isValid(p3));
    }

    @Test
    public void test_is_password_invalid_length_long() {
        String p4 = "aa-12345";
        assertFalse(cI.isValid(p4));
    }

    @Test
    public void test_is_password_valid() {
        String p5 = "Aa-12345";
        assertTrue(cI.isValid(p5));
    }

    @Test
    public void create_user_test() throws Exception {

        Customer user = new Customer();

        user.setCustomerId(5L);
        user.setUserName("kirtan");
        user.setEmail("kirtan@sample.com");
        user.setPassword("Pass@word123");
        user.setSecurityAnswer("yes");

        // Here we are "mocking" the repository. Basically, doing this allows us
        // to avoid communicating with the database.

        String result = customerService.signUp(user);
        Assertions.assertEquals("sign up success", result);
    }

    @Test
    public void login_user_correct_credentials_returns_correct_username() {

        Customer testCustomer = new Customer();
        testCustomer.setEmail("sample@dal.ca");
        testCustomer.setPassword("Password@123");
        testCustomer.setUserName("testUser");

        when(customerRepository.findAll()).thenReturn(Collections.singletonList(testCustomer));

        Customer loginUser = new Customer();
        loginUser.setEmail("sample@dal.ca");
        loginUser.setPassword("Password@123");

        Customer returnedCustomer = customerService.login(loginUser);

        Assertions.assertEquals(testCustomer.getUserName(), returnedCustomer.getUserName());
    }
    @Test
    public void login_user_correct_credentials_returns_correct_email() {

        Customer testCustomer = new Customer();
        testCustomer.setEmail("sample@dal.ca");
        testCustomer.setPassword("Password@123");
        testCustomer.setUserName("testUser");

        when(customerRepository.findAll()).thenReturn(Collections.singletonList(testCustomer));

        Customer loginUser = new Customer();
        loginUser.setEmail("sample@dal.ca");
        loginUser.setPassword("Password@123");

        Customer returnedCustomer = customerService.login(loginUser);

        Assertions.assertEquals(testCustomer.getEmail(), returnedCustomer.getEmail());
    }

    @Test
    public void testSignUpWithExistingEmail(){
        Customer testCustomer = new Customer();
        testCustomer.setEmail("kirtan@sample.com");
        testCustomer.setPassword("Password@321");
        testCustomer.setUserName("Kirtan");

        when(customerRepository.findAll()).thenReturn(Collections.singletonList(testCustomer));

        Customer newCustomer = new Customer();
        newCustomer.setEmail("kirtan@sample.com");
        newCustomer.setPassword("Password@321");
        newCustomer.setUserName("zhaojie");

        String signUpMessage = customerService.signUp(newCustomer);

        Assertions.assertEquals("Username or email already exists!", signUpMessage);

    }

    @Test
    public void reset_password_test() {
        Customer customer = new Customer();
        customer.setCustomerId(5L);
        customer.setEmail("sample@dal.ca");
        customer.setPassword("Password@111");
        customer.setSecurityAnswer("yes");

        when(customerRepository.findAll()).thenReturn(Collections.singletonList(customer));
        Customer updatedCustomer = new Customer();
        updatedCustomer.setCustomerId(5L);
        updatedCustomer.setEmail("sample@dal.ca");
        updatedCustomer.setPassword("Password@222");
        updatedCustomer.setSecurityAnswer("yes");
        when(customerRepository.save(any(Customer.class))).thenReturn(updatedCustomer);

        Customer responseCustomer = customerService.resetPassword(updatedCustomer);
        Assertions.assertEquals(updatedCustomer.getPassword(), responseCustomer.getPassword());
    }

    @Test
    public void assign_workspace_test() {
        Customer customer = new Customer();
        customer.setCustomerId(5L);
        Workspace workspace = new Workspace();
        workspace.setWorkspaceId(1L);
        when(workspaceService.findById(anyLong())).thenReturn(workspace);
        when(customerRepository.findById(anyLong())).thenReturn(Optional.of(customer));
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);
        Customer responseCustomer = customerService.assignWorkspace(5L, 1L);
        assertTrue(responseCustomer.getWorkspaces().contains(workspace));
    }

    @Test
    public void get_workspace_member_test() {
        Customer customer = new Customer();
        customer.setCustomerId(5L);
        Workspace workspace = new Workspace();
        workspace.setWorkspaceId(1L);
        customer.getMemberWorkspaces().add(workspace);
        when(workspaceService.findById(anyLong())).thenReturn(workspace);
        when(customerRepository.findAll()).thenReturn(Collections.singletonList(customer));
        List<Customer> customers = customerService.getWorkspaceMember(1L);
        assertTrue(customers.contains(customer));
    }
}