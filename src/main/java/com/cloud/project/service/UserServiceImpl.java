// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.SubscribeRequest;
import com.amazonaws.services.sns.model.Subscription;
import com.cloud.project.constants.AppConstants;
import com.cloud.project.model.User;
import com.cloud.project.repository.UserRepository;
import com.google.gson.Gson;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AmazonSNSClient amazonSNSClient;

	@Value("${amazon.sns.topic.arn}")
	private String TOPIC_ARN;

	@Override
	public String registerUser(User user) {
		try {
			String email = user.getEmail();
			if (userRepository.getUserByEmail(email) == null) {
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				String encryptedPassword = encoder.encode(user.getPassword());
				user.setPassword(encryptedPassword);
				userRepository.registerUser(user);
				return AppConstants.SUCCESS;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return AppConstants.FAILURE;
	}

	@Override
	public String registerSNSUser(User user) {
		try {
			String email = user.getEmail();
			if (userRepository.getUserByEmail(email) == null) {
				SubscribeRequest subscribeRequest = new SubscribeRequest(TOPIC_ARN, "email", email);
				amazonSNSClient.subscribe(subscribeRequest);
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				String encryptedPassword = encoder.encode(user.getPassword());
				user.setPassword(encryptedPassword);
				userRepository.registerUser(user);
				return AppConstants.SUCCESS;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return AppConstants.FAILURE;
	}

	@Override
	public User loginUser(String email, String password) {
		try {
			User user = userRepository.getUserByEmail(email);
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			if (user != null && encoder.matches(password, user.getPassword()))
				return user;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public User loginSNSUser(String email, String password) {
		try {
			// Checking if the user confirmed the subscription email he/she received
			List<Subscription> subscriptions = amazonSNSClient.listSubscriptionsByTopic(TOPIC_ARN).getSubscriptions();
			for (Subscription subscription : subscriptions) {
				if (subscription.getEndpoint().equals(email)) {
					if (subscription.getSubscriptionArn().equals(AppConstants.SUBSCRIBER_PENDING_CONFIRMATION))
						return null;
					break;
				}
			}
			User user = userRepository.getUserByEmail(email);
			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
			if (user != null && encoder.matches(password, user.getPassword()))
				return user;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public User getUserById(String userId) {
		User user = userRepository.getUserById(userId);
		if (user != null)
			return user;
		return null;
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.getAllUsers();
	}

	@Override
	public User updateUserById(String userId, User user) {
		return userRepository.updateUserById(userId, user);
	}

	@Override
	public String deleteUserById(String userId) {
		userRepository.deleteUserById(userId);
		return AppConstants.SUCCESS;
	}

	@Override
	public String publishMsg(String msg) {
		PublishRequest publishRequest = new PublishRequest(TOPIC_ARN, msg, AppConstants.SNS_Subject);
		amazonSNSClient.publish(publishRequest);
		return "Message published";
	}

	@Override
	public String getSNSList() {
		return new Gson().toJson(amazonSNSClient.listSubscriptionsByTopic(TOPIC_ARN));
	}

}
