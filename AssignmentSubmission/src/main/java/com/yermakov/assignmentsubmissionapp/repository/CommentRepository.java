package com.yermakov.assignmentsubmissionapp.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.yermakov.assignmentsubmissionapp.domain.Comment;

// Spring Data Jpa - JpaRepository. Great way to quickly get access to CRUD SQL functionality
// <T, ID> T - object (Comment here); ID  - object's id type (Long here)
public interface CommentRepository extends JpaRepository<Comment, Long>{

	@Query("select c from Comment c "
			+ " where c.assignment.id = :assignmentId")
	Set<Comment> findByAssignmentId(Long assignmentId);
}
