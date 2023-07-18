package com.yermakov.assignmentsubmissionapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yermakov.assignmentsubmissionapp.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {

	// JPA will type the finding query of the username for us
	Optional<User> findByUsername(String username);

}
