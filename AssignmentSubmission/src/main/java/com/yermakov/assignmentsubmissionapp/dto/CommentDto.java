package com.yermakov.assignmentsubmissionapp.dto;

import java.time.ZonedDateTime;

// created it because front-end sends us only 3 params 
// so this is the object we receive from the front-end
// then with the help of CommentService .save method 
// we would transfer this dto to the whole Comment object MySql awaits from us
public class CommentDto {
	private Long id;
	private Long assignmentId;
	private String text;
	private String user; // here it means Jwt rather than user
	private ZonedDateTime createdDate;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getAssignmentId() {
		return assignmentId;
	}

	public void setAssignmentId(Long assignmentId) {
		this.assignmentId = assignmentId;
	}

	public String getText() {
		return text;
	}

	public void setText(String textString) {
		this.text = textString;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public ZonedDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(ZonedDateTime createdDate) {
		this.createdDate = createdDate;
	}

	@Override
	public String toString() {
		return "CommentDto [id=" + id + ", assignmentId=" + assignmentId + ", text=" + text + ", user=" + user
				+ ", createdDate=" + createdDate + "]";
	}
}
