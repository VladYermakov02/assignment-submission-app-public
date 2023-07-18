package com.yermakov.assignmentsubmissionapp.util;

import org.hibernate.engine.internal.StatisticalLoggingSessionEventListener;

import com.yermakov.assignmentsubmissionapp.domain.User;

public class AuthorityUtil {

	public static Boolean hasRole(String role, User user) {
		return user.getAuthorities()
				.stream()
				.filter(auth -> auth.getAuthority().equals(role))
				.count() > 0;
	}
}
