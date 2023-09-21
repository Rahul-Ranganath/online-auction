// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.cloud.project.model.Items;

@Repository
public class ItemRepository {

	@Autowired
	private DynamoDBMapper dbMapper;

	public Items saveItem(Items item) {
		try {
			dbMapper.save(item);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return item;
	}

	public Items getItemById(String itemId) {
		return dbMapper.load(Items.class, itemId);
	}

	public List<Items> getAllItems() {
		return dbMapper.scan(Items.class, new DynamoDBScanExpression());
	}

	public String deleteItemById(String itemId) {
		Items item = dbMapper.load(Items.class, itemId);
		dbMapper.delete(item);
		return "Item Id : " + itemId + " Deleted!";
	}

	public String update(String itemId, Items item) {
		try {
			dbMapper.save(item, buildDynamoDBSaveExpression(itemId));
		} catch (ConditionalCheckFailedException exception) {
			System.out.println(exception.getMessage());
		}
		return itemId;
	}

	public DynamoDBSaveExpression buildDynamoDBSaveExpression(String itemId) {
		DynamoDBSaveExpression saveExpression = new DynamoDBSaveExpression();
		Map<String, ExpectedAttributeValue> expected = new HashMap<>();
		expected.put("itemId",
				new ExpectedAttributeValue(new AttributeValue(itemId)).withComparisonOperator(ComparisonOperator.EQ));
		saveExpression.setExpected(expected);
		return saveExpression;
	}
}
