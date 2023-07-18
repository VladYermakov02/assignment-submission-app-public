package com.yermakov.assignmentsubmissionapp.dto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.yermakov.assignmentsubmissionapp.domain.Assignment;
import com.yermakov.assignmentsubmissionapp.enums.AssignmentStatusEnum;
import com.yermakov.assignmentsubmissionapp.enums.AssignmentTypeEnum;

public class AssignmentResponseDto {

	private Assignment assignment;
	private AssignmentTypeEnum[] assignmentTypeEnums = AssignmentTypeEnum.values();
	private AssignmentStatusEnum[] statusEnums = AssignmentStatusEnum.values();
	
	public AssignmentResponseDto(Assignment assignment) {
		super();
		this.assignment = assignment;
	}

	public Assignment getAssignment() {
		return assignment;
	}

	public void setAssignment(Assignment assignment) {
		this.assignment = assignment;
	}

	public AssignmentTypeEnum[] getAssignmentTypeEnums() {
		return assignmentTypeEnums;
	}

	public AssignmentStatusEnum[] getStatusEnums() {
		return statusEnums;
	}
}
