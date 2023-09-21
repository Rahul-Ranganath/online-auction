// SJSU CS 218 Fall 2021 TEAM3

package com.cloud.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

@Configuration
public class DBConfig {

	@Value("${amazon.access.key}")
	private String amazonAWSAccessKey;
	
	@Value("${amazon.access.secret-key}")
	private String amazonAWSSecretKey;
	
	@Value("${amazon.region}")
	private String amazonAWSRegion;
	
	@Value("${amazon.end-point.url}")
	private String amazonDynamoDBEndpoint;

	@Bean
	public DynamoDBMapper mapper() {
		return new DynamoDBMapper(amazonDynamoDBConfig());
	}

	public AmazonDynamoDB amazonDynamoDBConfig() {
		return AmazonDynamoDBClientBuilder.standard()
				.withEndpointConfiguration(
						new AwsClientBuilder.EndpointConfiguration(amazonDynamoDBEndpoint, amazonAWSRegion))
				.withCredentials(new AWSStaticCredentialsProvider(
						new BasicAWSCredentials(amazonAWSAccessKey, amazonAWSSecretKey)))
				.build();
	}
}
