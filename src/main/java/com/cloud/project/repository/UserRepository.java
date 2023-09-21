// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.cloud.project.model.User;

@Repository
public class UserRepository {

	@Autowired
	private DynamoDBMapper dbMapper;

	public User registerUser(User user) {
		try {
			dbMapper.save(user);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return user;
	}

	public User getUserById(String userId) {
		return dbMapper.load(User.class, userId);
	}

	public User getUserByEmail(String email) {
		List<User> res = new ArrayList<User>();
		try {
			User user = new User();
			user.setEmail(email);
			DynamoDBQueryExpression<User> expression = new DynamoDBQueryExpression<User>().withHashKeyValues(user)
					.withIndexName("email-index").withConsistentRead(false);
			res = dbMapper.query(User.class, expression);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res.size() > 0 ? res.get(0) : null;
	}

	public List<User> getAllUsers() {
		return dbMapper.scan(User.class, new DynamoDBScanExpression());
	}

	public String deleteUserById(String userId) {
		User user = dbMapper.load(User.class, userId);
		dbMapper.delete(user);
		return "user Id : " + userId + " Deleted!";
	}

	public User updateUserById(String userId, User user) {
		dbMapper.save(user, new DynamoDBSaveExpression().withExpectedEntry("userId",
				new ExpectedAttributeValue(new AttributeValue().withS(userId))));
		return user;
	}
}
