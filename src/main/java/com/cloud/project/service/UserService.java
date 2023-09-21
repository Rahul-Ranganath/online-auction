// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.service;

import java.util.List;

import com.cloud.project.model.User;

public interface UserService {

	public String registerUser(User user);
	
	public String registerSNSUser(User user);
	
	public String publishMsg(String msg);
	
	public String getSNSList();

	public User loginUser(String email, String password);

	public User loginSNSUser(String email, String password);
	
	public User getUserById(String userId);

	public List<User> getAllUsers();

	public User updateUserById(String userId, User user);
	
	public String deleteUserById(String userId);
}
