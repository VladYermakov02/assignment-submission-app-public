package com.yermakov.assignmentsubmissionapp.web;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.authentication.UserServiceBeanDefinitionParser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yermakov.assignmentsubmissionapp.domain.Assignment;
import com.yermakov.assignmentsubmissionapp.domain.User;
import com.yermakov.assignmentsubmissionapp.dto.AssignmentResponseDto;
import com.yermakov.assignmentsubmissionapp.enums.AuthorityEnum;
import com.yermakov.assignmentsubmissionapp.service.AssignmentService;
import com.yermakov.assignmentsubmissionapp.service.UserService;
import com.yermakov.assignmentsubmissionapp.util.AuthorityUtil;

// Controllers listen to the end-points
// so to speak listen to all the posts, reads, deletes, updates and so on
@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

	// all business logic should not be done here
	// controller class only has to take data and pass it to the front-end
	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private UserService userService;

	@PostMapping("")
	public ResponseEntity<?> createAssignment(@AuthenticationPrincipal User user) {
		Assignment newAssignment = assignmentService.save(user);
		return ResponseEntity.ok(newAssignment);
	}

	@GetMapping("")
	public ResponseEntity<?> getAssignments(@AuthenticationPrincipal User user) {
		Set<Assignment> assignmentByUser = assignmentService.findByUser(user);
		return ResponseEntity.ok(assignmentByUser);
	}

	// path variable / dynamic variable
	@GetMapping("{assignmentId}")
	public ResponseEntity<?> getAssignment(@PathVariable Long assignmentId, @AuthenticationPrincipal User user) {
		Optional<Assignment> assignmentOptional = assignmentService.findById(assignmentId);
		return ResponseEntity.ok(new AssignmentResponseDto(assignmentOptional.orElse(new Assignment())));
	}

	// @RequestBody is an assignment we're getting from the front-end
	@PutMapping("{assignmentId}")
	public ResponseEntity<?> updateAssignment(@PathVariable Long assignmentId, @RequestBody Assignment assignment,
			@AuthenticationPrincipal User user) {
		// add the code reviewer to this assignment if it was claimed
		// every time we use put (update the assignment) it is going to go through this code (if reviewer is assigned)
		// better thing would be if we could avoid this check every time
		if (assignment.getCodeReviewer() != null) {
			User codeReviewer = assignment.getCodeReviewer();
			codeReviewer = userService.finUserByUsername(codeReviewer.getUsername()).orElse(new User());
			if (AuthorityUtil.hasRole(AuthorityEnum.ROLE_CODE_REVIEWER.name(), codeReviewer)) {
				assignment.setCodeReviewer(codeReviewer);
			}
		}
		Assignment updatedAssignment = assignmentService.save(assignment);
		return ResponseEntity.ok(updatedAssignment);
	}
}
