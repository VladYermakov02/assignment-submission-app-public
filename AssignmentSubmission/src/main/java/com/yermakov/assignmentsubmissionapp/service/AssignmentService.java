package com.yermakov.assignmentsubmissionapp.service;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.yermakov.assignmentsubmissionapp.domain.Assignment;
import com.yermakov.assignmentsubmissionapp.domain.Authority;
import com.yermakov.assignmentsubmissionapp.domain.User;
import com.yermakov.assignmentsubmissionapp.enums.AssignmentStatusEnum;
import com.yermakov.assignmentsubmissionapp.enums.AuthorityEnum;
import com.yermakov.assignmentsubmissionapp.repository.AssignmentRepository;

@Service
public class AssignmentService {

	@Autowired
	private AssignmentRepository assignmentRepo;

	// better named create() next time
	public Assignment save(User user) {
		Assignment assignment = new Assignment();
		assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
		assignment.setNumber(findNextAssignmentToSubmit(user));
		assignment.setUser(user);

		return assignmentRepo.save(assignment);
	}

	private Integer findNextAssignmentToSubmit(User user) {
		Set<Assignment> assignmentsByUser = assignmentRepo.findByUser(user);
		if (assignmentsByUser == null) {
			return 1;
		}
		Optional<Integer> nextAssignmentNumberOpt = assignmentsByUser.stream().sorted((assignment1, assignment2) -> {
			if (assignment1.getNumber() == null)
				return 1;
			if (assignment2.getNumber() == null)
				return 1;
			return assignment2.getNumber().compareTo(assignment1.getNumber());
		}).map(assignment -> {
			if (assignment.getNumber() == null)
				return 1;
			return assignment.getNumber() + 1;
		}).findFirst();
		return nextAssignmentNumberOpt.orElse(1);
	}

	// repositories should be in Services and never in Controllers.
	// so we realize it here
	public Set<Assignment> findByUser(User user) {
		// this logic could be put in @GetMapping("")in AssignmentController
		// but logic should never be put in Controllers.
		// controllers just do CRUD and all that stuff
		boolean hasCodeReviewerRole = user.getAuthorities().stream()
				.filter(authority -> AuthorityEnum.ROLE_CODE_REVIEWER.name().equals(authority.getAuthority()))
				.count() > 0;
		if (hasCodeReviewerRole) {
			return assignmentRepo.findByCodeReviewer(user);
		} else {
			return assignmentRepo.findByUser(user);
		}
	}

	public Optional<Assignment> findById(Long assignmentId) {
		return assignmentRepo.findById(assignmentId);
	}

	public Assignment save(Assignment assignment) {
		return assignmentRepo.save(assignment);
	}
}
