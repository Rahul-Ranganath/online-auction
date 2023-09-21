// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class YoubidApplication {

	public static void main(String[] args) {
		SpringApplication.run(YoubidApplication.class, args);
	}

}
