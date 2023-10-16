package com.group11.trello.service.implementation;

import com.group11.trello.bean.Customer;
import com.group11.trello.bean.Task;
import com.group11.trello.bean.Workspace;
import com.group11.trello.repository.CustomerRepository;
import com.group11.trello.service.BoardService;
import com.group11.trello.service.CustomerService;
import com.group11.trello.service.TaskService;
import com.group11.trello.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Customer/User service methods implement
 */
@Service
public class CustomerImplementation implements CustomerService {
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    WorkspaceService workspaceService;
    @Autowired
    BoardService boardService;
    @Autowired
    TaskService taskService;

    private static final int MINIMUM_PASSWORD_LENGTH = 8;
    private static final Pattern HAS_UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern HAS_LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern HAS_DIGIT = Pattern.compile("[0-9]");
    private static final Pattern HAS_SPECIAL_CHAR = Pattern.compile("[~!@#$%^&*()_+=.,?/-]");

    @Autowired
    public CustomerImplementation(CustomerRepository customerRepository, WorkspaceService workspaceService) {
        this.customerRepository = customerRepository;
        this.workspaceService = workspaceService;
    }

    public CustomerImplementation() {

    }

    /**
     * Registration method that checks the users sent by the front-end and
     * decides whether to store them in the database
     *
     * @param customer User JSON sent from the front end by accessing /customer/save
     * @return a string as a response to the front-end
     */
    @Override
    public String signUp(Customer customer) {
        // Check if all users in the database have the same name or emal as the new user
        List<Customer> allCustomers = getAllCustomers();
        for (Customer c : allCustomers) {
            if (c.getUserName().equals(customer.getUserName()) ||
                    c.getEmail().equals(customer.getEmail())) {
                System.out.println("A registration request was received, but the information is duplicated");
                return "Username or email already exists!";
            }
        }

        // If the new user does not exist, then check if the password matches the requirements
        if (isValid(customer.getPassword())) {
            System.out.println("A registration request was received, done");
            customerRepository.save(customer); // save this new user into database
            return "sign up success"; // Return this to the front-end to check
        } else {
            System.out.println("A registration request was received, but the password is invalid");
            return """
                    Password is not valid!
                    Make sure your password contains at least:
                        one lowercase letter
                        one uppercase letter and
                        one special symbol: ~!@#$%^&*()_+=.,?/-""";
        }
    }

    /**
     * get all customers stored in database
     *
     * @return a list contains all customers
     */
    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Method is used to check whether the email and password
     * given by the user match the data in the database
     *
     * @param customer User-entered email and password information
     * @return null or complete information about a customer
     */
    @Override
    public Customer login(Customer customer) {
        String email = customer.getEmail();
        String password = customer.getPassword();

        Customer login = null;

        // Check the database for matching emails and passwords
        List<Customer> allCustomers = getAllCustomers();
        for (Customer c : allCustomers) {
            if (c.getEmail().equals(email) && c.getPassword().equals(password)) {
                login = c; // find customer
                break;
            }
        }

        if (login == null) { // no user found
            System.out.println("A login request is sent, but the user is not found");
        }

        return login;
    }

    /**
     * Method for resetting user password
     *
     * @param customer JSON containing the email, security answer, and the new password
     * @return null or complete information about a customer
     */
    @Override
    public Customer resetPassword(Customer customer) {
        String email = customer.getEmail();
        String securityAnswer = customer.getSecurityAnswer();
        String newPassword = customer.getPassword();

        Customer update = null;

        // Check the database for matching emails and security answer
        List<Customer> allCustomers = getAllCustomers();
        for (Customer c : allCustomers) {
            if (c.getEmail().equals(email) && c.getSecurityAnswer().equals(securityAnswer)) {
                update = c; // find customer
                break;
            }
        }

        if (update == null) { // no user found
            System.out.println("A password-reset request is sent, but the user is not found");
            return null;
        }

        // update the new password to the found user
        if (isValid(newPassword)) {
            update.setPassword(newPassword);
            System.out.println("A password-reset request is sent, changed");
            return customerRepository.save(update);
        } else {
            System.out.println("A password-reset request is sent, but the password is invalid");
            return null;
        }
    }

    /**
     * This method should be called right after createWorkspace to assign the
     * created workspace to the user
     *
     * @param userId      Who will own this new workspace
     * @param workspaceId the new workspace
     * @return this user object
     */
    @Override
    public Customer assignWorkspace(long userId, long workspaceId) {
        Customer assigned = null;
        Optional<Customer> user;

        try {
            user = customerRepository.findById(userId);
            if (user.isPresent()) {
                Customer customer = user.get();
                Workspace workspace = workspaceService.findById(workspaceId);

                customer.getWorkspaces().add(workspace);
                customer.getMemberWorkspaces().add(workspace);

                assigned = customerRepository.save(customer);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return assigned;
    }

    @Override
    public List<Customer> getWorkspaceMember(long workspaceId) {
        Workspace workspace = workspaceService.findById(workspaceId);
        if (workspace == null) return null;

        List<Customer> member = new ArrayList<>();
        List<Customer> allCustomers = getAllCustomers();
        for (Customer c : allCustomers) {
            if (c.getMemberWorkspaces().contains(workspace)) {
                member.add(c);
            }
        }

        return member;
    }

    @Override
    public List<Customer> addMember(String userName, long workspaceId) {
        Workspace workspace = workspaceService.findById(workspaceId);
        Customer customer = findByUserName(userName);
        if (workspace == null || customer == null) {
            return null;
        }

        if (customer.getMemberWorkspaces().contains(workspace)) {
            System.out.println("already is member");
            return null;
        }

        customer.getMemberWorkspaces().add(workspace);
        customerRepository.save(customer);
        return getWorkspaceMember(workspaceId);
    }

    public Customer findByUserName(String userName) {
        List<Customer> allCustomer = getAllCustomers();
        Customer customer = null;
        for (Customer c : allCustomer) {
            if (c.getUserName().equals(userName)) {
                customer = c;
                break;
            }
        }
        return customer;
    }

    /**
     * Helper for signUp
     * method to check if the user's password matches the requirements
     *
     * @param password customer/user's password
     * @return true if password is valid
     */
    public boolean isValid(String password) {

        boolean lengthIsValid = password.length() >= MINIMUM_PASSWORD_LENGTH;
        boolean hasUppercase = HAS_UPPERCASE.matcher(password).find();
        boolean hasLowercase = HAS_LOWERCASE.matcher(password).find();
        boolean hasDigit = HAS_DIGIT.matcher(password).find();
        boolean hasSpecialChar = HAS_SPECIAL_CHAR.matcher(password).find();

        return lengthIsValid && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
    }

    @Override
    public Task assignMemberToTask(long workspaceId, long taskId, String userName) {
        List<Customer> members = getWorkspaceMember(workspaceId);
        Customer customer = findByUserName(userName);

        if (members == null || customer == null) {
            System.out.println("sth error");
            return null;
        }

        if (!members.contains(customer)) {
            System.out.println("this user is not a member of this workspace");
            return null;
        }

        Task task = taskService.findById(taskId);
        task.setUser(customer.getUserName());

        return taskService.save(task);
    }
}
