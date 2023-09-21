// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.model;

import java.util.List;

public class DashboardData {

	private List<Items> sellItemsList;

	private List<Items> itemsList;

	public List<Items> getSellItemsList() {
		return sellItemsList;
	}

	public void setSellItemsList(List<Items> sellItemsList) {
		this.sellItemsList = sellItemsList;
	}

	public List<Items> getItemsList() {
		return itemsList;
	}

	public void setItemsList(List<Items> itemsList) {
		this.itemsList = itemsList;
	}

}
