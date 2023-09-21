// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.service;

import java.util.List;

import com.cloud.project.model.DashboardData;
import com.cloud.project.model.Items;

public interface ItemService {

	String bidItem(String itemId, String userId, int bidAmount);

	Items sellItem(String userId, Items item);

	Items getItemById(String itemId);

	List<Items> getAllItems();

	DashboardData retrieveData(String userId);

	String deleteItemById(String itemId);
}
