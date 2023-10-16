package com.group11.trello.bean;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Customer/User entity design
 */
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long customerId;

    private String userName;
    private String email;
    private String password;
    private String securityAnswer;

    // The workspaces created (owned) by a user exist in this list
    @OneToMany(targetEntity = Workspace.class)
    @JoinColumn(name = "workspace_owner_id")
    private List<Workspace> workspaces = new ArrayList<>();

    // A user belongs to which workspace_member exist in this list
    @ManyToMany
    @JoinTable(
            name = "workspace_member",
            joinColumns = @JoinColumn(name = "member_id"),
            inverseJoinColumns = @JoinColumn(name = "workspace_id")
    )
    private List<Workspace> memberWorkspaces = new ArrayList<>();

    // Constructors
    public Customer() {
    }

    public Customer(String userName, String email, String password, String securityAnswer) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.securityAnswer = securityAnswer;
    }

    // Getters and Setters
    public List<Workspace> getMemberWorkspaces() {
        return memberWorkspaces;
    }

    public void setMemberWorkspaces(List<Workspace> memberWorkspaces) {
        this.memberWorkspaces = memberWorkspaces;
    }

    public List<Workspace> getWorkspaces() {
        return workspaces;
    }

    public void setWorkspaces(List<Workspace> workspaces) {
        this.workspaces = workspaces;
    }

    public long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(long customerId) {
        this.customerId = customerId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSecurityAnswer() {
        return securityAnswer;
    }

    public void setSecurityAnswer(String securityAnswer) {
        this.securityAnswer = securityAnswer;
    }
}
