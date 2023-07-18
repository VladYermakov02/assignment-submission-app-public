package com.yermakov.assignmentsubmissionapp.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.yermakov.assignmentsubmissionapp.domain.Assignment;
import com.yermakov.assignmentsubmissionapp.domain.Comment;
import com.yermakov.assignmentsubmissionapp.domain.User;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

	// findBy reserved phrase by JPA
	// also, findById is implemented automatically somewhere in the background
	// so JPA knows that User is the parameter of Assignment so it will create query
	// in database by itself
	Set<Assignment> findByUser(User user);

	// 'Assignment' here has to match JpaRepository<'Assignment', Long> that Assignment
	// ':' injects a parameter into the a query
	// for example in ":codeReviewer" codeReviewer is a parameter taken from (User codeReviewer).
	// And a.codeReviewer this is taken from Assignment class (its parameter )
	@Query("select a from Assignment a "
			+ "where (a.status = 'submitted' and (a.codeReviewer is null or a.codeReviewer = :codeReviewer))"
			+ "or a.codeReviewer = :codeReviewer")
	Set<Assignment> findByCodeReviewer(User codeReviewer);
}
