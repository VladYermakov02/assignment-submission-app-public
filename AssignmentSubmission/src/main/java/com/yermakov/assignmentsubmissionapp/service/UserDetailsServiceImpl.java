package com.yermakov.assignmentsubmissionapp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yermakov.assignmentsubmissionapp.domain.User;
import com.yermakov.assignmentsubmissionapp.repository.UserRepository;
import com.yermakov.assignmentsubmissionapp.util.CustomPasswordEncoder;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private CustomPasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) {
		try {
			// 'find by' is a special prefix
			// when JPA sees that prefix
			// it will try to find table with the name that goes after the prefix
			Optional<User> userOpt = userRepo.findByUsername(username);
			return userOpt.orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
		} catch (UsernameNotFoundException u) {
			u.printStackTrace();
			return null;
		}
	}
}
