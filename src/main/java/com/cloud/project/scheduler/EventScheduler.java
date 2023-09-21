// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.scheduler;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cloud.project.model.Items;
import com.cloud.project.model.User;
import com.cloud.project.repository.ItemRepository;
import com.cloud.project.repository.UserRepository;
import com.cloud.project.service.ItemService;
import com.cloud.project.service.UserService;

@Component
public class EventScheduler {

	@Autowired
	private ItemService itemService;

	@Autowired
	private UserService userService;

	@Autowired
	private ItemRepository itemRepository;

	@Autowired
	private UserRepository userRepository;

	@Value("${amazon.sns.enable}")
	private boolean SNS_Enabled;

	// Running cron job at 11:55 PM
	@Scheduled(cron = "0 55 23 * * *", zone="PST")
	public void checkExpiredItemsResult() {
		try {
			Date date = new Date();
			String today = new SimpleDateFormat("MM/dd/yy").format(date);
			System.out.println("Testing EventScheduler in scheduler at " + today);
			List<Items> items = itemService.getAllItems();
			for (Items item : items) {
				if (!item.isExpired() && item.getExpiryDate() != null && item.getExpiryDate().equals(today)) {
					item.setExpired(true);
					itemRepository.update(item.getItemId(), item);
					String winnerUserId = item.getHighestBidder();
					if (winnerUserId.equals("N/A")) {
						if (SNS_Enabled)
							userService.publishMsg(item.getName() + " has expired");
					} else {
						User user = userService.getUserById(winnerUserId);
						if (user != null) {
							user.setBidsWon(
									user.getBidsWon().equals("N/A") ? item.getItemId() : "," + item.getItemId());
							userRepository.updateUserById(winnerUserId, user);
							if (SNS_Enabled)
								userService.publishMsg(item.getName() + " has expired and the winner is "
										+ user.getFirstName() + " " + user.getLastName());
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
