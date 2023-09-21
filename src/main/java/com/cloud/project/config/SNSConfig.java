// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;

@Configuration
public class SNSConfig {

	@Value("${amazon.access.key}")
	private String amazonAWSAccessKey;

	@Value("${amazon.access.secret-key}")
	private String amazonAWSSecretKey;

	@Value("${amazon.region}")
	private String amazonAWSRegion;

	@Primary
	@Bean
	public AmazonSNSClient getSNSClient() {
		return (AmazonSNSClient) AmazonSNSClientBuilder.standard().withRegion(amazonAWSRegion).withCredentials(
				new AWSStaticCredentialsProvider(new BasicAWSCredentials(amazonAWSAccessKey, amazonAWSSecretKey)))
				.build();
	}
}
