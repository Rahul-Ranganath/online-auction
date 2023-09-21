// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cloud.project.model.DashboardData;
import com.cloud.project.model.Items;
import com.cloud.project.model.User;
import com.cloud.project.service.ItemService;

@RestController
public class ItemController {

	@Autowired
	private ItemService itemService;

	@PostMapping("/sellItem/{userId}")
	public Items sellItem(@PathVariable("userId") String userId, @RequestBody Items item) {
		return itemService.sellItem(userId, item);
	}

	@PostMapping("/bidItem/{itemId}")
	public String bidItem(@PathVariable("itemId") String itemId, @RequestBody User user) {
		return itemService.bidItem(itemId, user.getUserId(), Integer.parseInt(user.getBidItemAmount()));
	}

	@GetMapping("/item/{itemId}")
	public Items getItem(@PathVariable("itemId") String itemId) {
		return itemService.getItemById(itemId);
	}

	@GetMapping("/allItems")
	public List<Items> getAllItems() {
		return itemService.getAllItems();
	}

	@GetMapping("/retrieveData/{userId}")
	public DashboardData retrieveData(@PathVariable("userId") String userId) {
		return itemService.retrieveData(userId);
	}

	@GetMapping("/delete/item/{itemId}")
	public String deleteUserById(@PathVariable("itemId") String itemId) {
		return itemService.deleteItemById(itemId);
	}

}
