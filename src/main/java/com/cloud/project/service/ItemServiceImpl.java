// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cloud.project.constants.AppConstants;
import com.cloud.project.model.DashboardData;
import com.cloud.project.model.Items;
import com.cloud.project.model.User;
import com.cloud.project.repository.ItemRepository;
import com.cloud.project.repository.UserRepository;

@Service
public class ItemServiceImpl implements ItemService {

	@Autowired
	private ItemRepository itemRepository;

	@Autowired
	private UserRepository userRepository;

	@Value("${amazon.sns.enable}")
	private boolean SNS_Enabled;

	@Override
	public String bidItem(String itemId, String userId, int bidAmount) {
		String status = "";
		try {
			User user = userRepository.getUserById(userId);
			// Not allowing the user who created the item to bid.
			if (user.getSellItems().contains(itemId))
				return "OWNER_BID_RESTRICTION";
			// Not allowing the user to place bid for the same item more than once.
			if (user.getBidItems().contains(itemId))
				return AppConstants.DUPLICATE_BID;
			Items item = itemRepository.getItemById(itemId);
			if (bidAmount > item.getHighestBid()) {
				item.setHighestBidder(userId);
				item.setHighestBid(bidAmount);
			}
			// TODO: Gotta fetch bid amount for the particular item id and change
			user.setBidItems(user.getBidItems().equals("N/A") ? itemId : user.getBidItems() + "," + itemId);
			String amount = String.valueOf(bidAmount);
			user.setBidItemAmount(
					user.getBidItemAmount().equals("N/A") ? amount : user.getBidItemAmount() + "," + amount);
			itemRepository.update(itemId, item);
			userRepository.updateUserById(userId, user);
			status = AppConstants.SUCCESS;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return status;
	}

	@Override
	public Items sellItem(String userId, Items item) {
		try {
			item.setHighestBid(item.getBaseAmount());
			Date today = new Date();
			item.setCreationTime(new SimpleDateFormat("MM/dd/yy").format(today));
			DateTime dtOrg = new DateTime(today);
			DateTime dtPlusOne = dtOrg.plusDays(1);
			item.setExpiryDate(new SimpleDateFormat("MM/dd/yy").format(dtPlusOne.toDate()));
			itemRepository.saveItem(item);
			User user = userRepository.getUserById(userId);
			user.setSellItems(user.getSellItems().equals("N/A") ? item.getItemId()
					: user.getSellItems() + "," + item.getItemId());
			userRepository.updateUserById(userId, user);
			return item;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return item;
	}

	@Override
	public Items getItemById(String itemId) {
		return itemRepository.getItemById(itemId);
	}

	@Override
	public List<Items> getAllItems() {
		return itemRepository.getAllItems();
	}

	@Override
	public DashboardData retrieveData(String userId) {
		DashboardData data = new DashboardData();
		try {
			User user = userRepository.getUserById(userId);
			List<Items> items = itemRepository.getAllItems();
			String sellItems = null;
			if (user != null)
				sellItems = user.getSellItems();
			String[] sellItemsArray = null;
			if (sellItems != null)
				sellItemsArray = sellItems.split(",");
			List<Items> sellItemsList = new ArrayList<Items>();
			List<Items> allItems = new ArrayList<Items>();
			for (int i = 0; i < items.size(); i++) {
				// Not including the items which are expired
				if (items.get(i).isExpired())
					continue;
				for (String s : sellItemsArray) {
					if (items.get(i).getItemId().equals(s))
						sellItemsList.add(items.get(i));
				}
				if (!sellItemsList.contains(items.get(i)))
					allItems.add(items.get(i));
			}
			data.setSellItemsList(sellItemsList);
			data.setItemsList(allItems);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return data;
	}

	@Override
	public String deleteItemById(String itemId) {
		try {
			Items item = itemRepository.getItemById(itemId);
			if (item.isExpired())
				return AppConstants.ITEM_EXPIRED;
			itemRepository.deleteItemById(itemId);
			List<User> users = userRepository.getAllUsers();
			boolean sellItemFound = false;
			for (User user : users) {
				if (!sellItemFound && user.getSellItems() != null && user.getSellItems().contains(itemId)) {
					String sellIds = "";
					String[] sellItems = user.getSellItems().split(",");
					for (int i = 0; i < sellItems.length; i++) {
						if (sellItems[i].equals(itemId)) {
							sellItemFound = true;
							continue;
						}
						sellIds += sellIds.length() == 0 ? sellItems[i] : "," + sellItems[i];
					}
					user.setSellItems(sellIds.length() > 0 ? sellIds : "N/A");
				}
				if (user.getBidItems() != null && user.getBidItemAmount() != null
						&& user.getBidItems().contains(itemId)) {
					String bidItemIds = "";
					String bidItemAmounts = "";
					String[] bidItems = user.getBidItems().split(",");
					String[] bidItemAmountsArr = user.getBidItemAmount().split(",");
					for (int i = 0; i < bidItems.length; i++) {
						if (bidItems[i].equals(itemId)) {
							continue;
						}
						bidItemIds += bidItemIds.length() == 0 ? bidItems[i] : "," + bidItems[i];
						bidItemAmounts += bidItemAmounts.length() == 0 ? bidItemAmountsArr[i]
								: "," + bidItemAmountsArr[i];
					}
					user.setBidItems(bidItemIds.length() > 0 ? bidItemIds : "N/A");
					user.setBidItemAmount(bidItemAmounts.length() > 0 ? bidItemAmounts : "N/A");
				}
				String userId = user.getUserId();
				userRepository.updateUserById(userId, user);
			}
			return AppConstants.SUCCESS;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return AppConstants.FAILURE;
	}
}
