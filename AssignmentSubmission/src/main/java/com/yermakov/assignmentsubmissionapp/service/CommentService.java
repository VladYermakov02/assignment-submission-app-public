package com.yermakov.assignmentsubmissionapp.service;

import java.time.ZonedDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yermakov.assignmentsubmissionapp.domain.Assignment;
import com.yermakov.assignmentsubmissionapp.domain.Comment;
import com.yermakov.assignmentsubmissionapp.domain.User;
import com.yermakov.assignmentsubmissionapp.dto.CommentDto;
import com.yermakov.assignmentsubmissionapp.repository.AssignmentRepository;
import com.yermakov.assignmentsubmissionapp.repository.CommentRepository;

@Service
public class CommentService {

	@Autowired
	private CommentRepository commentRepository;
	@Autowired
	private AssignmentRepository assignmentRepository;
	
	public Comment save(CommentDto commentDto, User user) {
		Comment comment = new Comment();
		// should use findById because it returns an optional when getById just returns an object
		Assignment assignment = assignmentRepository.getById(commentDto.getAssignmentId());
		comment.setAssignment(assignment);
		comment.setText(commentDto.getText());
		comment.setCreatedBy(user);
		if (comment.getId() == null) {			
			comment.setCreatedDate(ZonedDateTime.now());
		} else {			
			comment.setCreatedDate(commentDto.getCreatedDate());
		}
		// comment.setId - MySql does it for us - this worked for Post(Create) but for Update we need setId
		// it's ok if it's null because it means it's a new comment
		// but if the comment exists we need the id
		comment.setId(commentDto.getId());
		// we need an Entity to pass but commentDto is a DTO so we converted it
		return commentRepository.save(comment);
	}

	// List sometimes generates duplicates in sql (when getting)
	// so we use set
	public Set<Comment> getCommentsByAssignmentId(Long assignmentId) {
		Set<Comment> comments = commentRepository.findByAssignmentId(assignmentId);
		return comments;
	}
	
	// deleting (for git)
	public void delete(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
