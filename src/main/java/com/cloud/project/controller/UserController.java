// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.controller;

import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cloud.project.model.User;
import com.cloud.project.service.UserService;

@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@Value("${amazon.sns.enable}")
	private boolean SNS_Enabled;

	@GetMapping("/")
	public String test() {
		return "HOME";
	}

	@PostMapping("/registerUser")
	public String registerUser(@RequestBody User user) {
		return SNS_Enabled ? userService.registerSNSUser(user) : userService.registerUser(user);
	}

	@PostMapping("/registerSNSUser")
	public String registerSNSUser(@RequestBody User user) throws NoSuchAlgorithmException, NoSuchProviderException {
		return userService.registerSNSUser(user);
	}

	@GetMapping("/login/{email}/{password}")
	public User loginUser(@PathVariable("email") String email, @PathVariable("password") String password)
			throws NoSuchAlgorithmException, NoSuchProviderException {
		return SNS_Enabled ? userService.loginSNSUser(email, password) : userService.loginUser(email, password);
	}

	@GetMapping("/loginUser/{email}/{password}")
	public User loginSNSUser(@PathVariable("email") String email, @PathVariable("password") String password)
			throws NoSuchAlgorithmException, NoSuchProviderException {
		return userService.loginSNSUser(email, password);
	}

	@PostMapping("/publishMsg/{msg}")
	public String publishMsg(@PathVariable("msg") String msg) {
		return userService.publishMsg(msg);
	}

	@GetMapping("/getSNSList")
	public String getSNSList() {
		return userService.getSNSList();
	}

	@GetMapping("/user/{userId}")
	public User getUser(@PathVariable("userId") String userId) {
		return userService.getUserById(userId);
	}

	@DeleteMapping("/delete/user/{userId}")
	public String deleteUserById(@PathVariable("userId") String userId) {
		return userService.deleteUserById(userId);
	}

	@PutMapping("/update/user/{userId}")
	public User updateUser(@PathVariable("userId") String userId, @RequestBody User user) {
		return userService.updateUserById(userId, user);
	}
}
