package com.yermakov.assignmentsubmissionapp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yermakov.assignmentsubmissionapp.domain.User;
import com.yermakov.assignmentsubmissionapp.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepo;
	
	public Optional<User> finUserByUsername(String username) {
		return userRepo.findByUsername(username);
	}
}
