package com.yermakov.assignmentsubmissionapp.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AssignmentTypeEnum {
	ASSIGNMENT_1(1, "laboratory work (major subject)"),
	ASSIGNMENT_2(2, "laboratory work (minor subject)"),
	ASSIGNMENT_3(3, "coursework"),
	ASSIGNMENT_4(4, "project"),
	ASSIGNMENT_5(5, "bachelor's diploma"),
	ASSIGNMENT_6(6, "master's degree"),
	ASSIGNMENT_7(7, "academic work");
	
	private int assignmentNum;
	private String assignmentName;
	
	AssignmentTypeEnum(int assignmentNum, String assignmentName) {
		this.assignmentNum = assignmentNum;
		this.assignmentName = assignmentName;
	}

	public int getAssignmentNum() {
		return assignmentNum;
	}

	public String getAssignmentName() {
		return assignmentName;
	}
}
