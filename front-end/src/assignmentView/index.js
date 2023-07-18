import React, { useEffect, useRef, useState } from "react";
import myFetch from "../services/fetchService";
import { Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import StatusBadge from "../statusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../userProvider";
import Comment from "../comment";
import CommentContainer from "../CommentContainer";

const AssignmentView = () => {
  let navigate = useNavigate();
  //const [jwt, setJwt] = useLocalState("", "jwt");
  const user = useUser();
  // split detects what is in url and makes the decision based on the url
  //const assignmentId = window.location.href.split("/assignments/")[1];
  const { assignmentId } = useParams();
  //console.log("assignmentId", assignmentId);

  // is used to change info for sending to the back-end
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    number: null,
    status: null,
  });

  const [assignmentTypeEnums, setAssignmentTypeEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);

  const previousAssignmnetValue = useRef(assignment);
  //console.log(previousAssignmnetValue);

  function updateAssignment(property, value) {
    // here we dectracture the data from the original assignment object
    // and then it creates duplicate
    const newAssignment = { ...assignment };
    newAssignment[property] = value;
    setAssignment(newAssignment);
  }

  // saves new data and sends to the back-end
  function save(status) {
    if (status && assignment.status !== status) {
      updateAssignment("status", status);
    }
    else {
      persist();
    }
    // [1] - first enum
    // this implies that the student is submitting the assignment for the first time
    // statuses here are hardcoded from the number from the AssignmentStatusEnum.java
    // if (assignment.status === assignmentStatuses[0].status) {
    //   updateAssignment("status", assignmentStatuses[1].status);
    // } else {
    //   persist();
    // }
  }

  function persist() {
    myFetch(`/api/assignments/${assignmentId}`, "PUT", user.jwt, assignment)
      .then((assignmentData) => {
        setAssignment(assignmentData);
      });
  }

  // useEffect fires up this '() => {}' function based on this dependency '[assignment]'
  // everything that is in [] is a dependency
  useEffect(() => {
    if (previousAssignmnetValue.current.status !== assignment.status) {
      persist();
    }
    previousAssignmnetValue.current = assignment;
  }, [assignment]);

  // getting data from the back-end
  useEffect(() => {
    myFetch(`/api/assignments/${assignmentId}`, "GET", user.jwt)
      .then((assignmentResponse) => {
        // assignmentResponse.assignment we get from AssignmentResponseDto
        let assignmentData = assignmentResponse.assignment;
        if (assignmentData.branch === null) assignmentData.branch = "";
        if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
        setAssignment(assignmentData);
        // grab data from the back-end and plug it to the front-end
        setAssignmentTypeEnums(assignmentResponse.assignmentTypeEnums);
        setAssignmentStatuses(assignmentResponse.statusEnums);
        //console.log(assignmentResponse.statusEnums);
      });
  }, []);

  return (
    <Container className="mt-5">
      <Row className="d-flex align-items-center">
        <Col>
          {assignment.number
            ? (<h1>Assignment {assignment.number}</h1>)
            : (<></>)}
        </Col>
        <Col>
          <StatusBadge text={assignment.status} />
        </Col>
      </Row>
      {assignment ? (
        <>
          <Form.Group as={Row} className="my-3" controlId="assignmentName">
            <Form.Label column sm="3" md="2">
              Assignment Number:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <DropdownButton
                as={ButtonGroup}
                variant={'info'}
                title={
                  assignment.number
                    ? `Assignment: ${assignment.number}`
                    : "Select an Assignment"
                }
                onSelect={(selectedElement) => {
                  updateAssignment("number", selectedElement);
                }}
              >
                {assignmentTypeEnums.map((assignmentTypeEnum) => (
                  <Dropdown.Item
                    key={assignmentTypeEnum.assignmentNum}
                    eventKey={assignmentTypeEnum.assignmentNum}>
                    {assignmentTypeEnum.assignmentNum}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-3" controlId="githubUrl">
            <Form.Label column sm="3" md="2">
              Github URL:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="url"
                onChange={(event) => updateAssignment("githubUrl", event.target.value)}
                value={assignment.githubUrl}
                placeholder="https://guthub.com/username/reponame" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="branch">
            <Form.Label column sm="3" md="2">
              Branch:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="text"
                onChange={(event) => updateAssignment("branch", event.target.value)}
                value={assignment.branch}
                placeholder="branch name" />
            </Col>
          </Form.Group>

          {assignment.status === "Completed" ? (
            (
              <>
                <Form.Group as={Row} className="d-flex align-items-center mb-3" controlId="codeReviewVideoUrl">
                  <Form.Label column sm="3" md="2">
                    Code Review Video URL:
                  </Form.Label>
                  <Col sm="9" md="8" lg="6">
                    <a
                      href={assignment.codeReviewVideoUrl}
                      style={{ fontWeight: "bold" }}
                    >
                      {assignment.codeReviewVideoUrl}
                    </a>
                  </Col>
                </Form.Group>
                <div className="d-flex gap-5">
                  <Button size="lg" variant="secondary" onClick={() => navigate("/dashboard")}>Back</Button>
                </div>
              </>
            )
          ) : assignment.status === "Pending Submission" ?
            (
              <div className="d-flex gap-5">
                <Button size="lg" onClick={() => save("Submitted")}>Submit Assignment</Button>
                <Button size="lg" variant="secondary" onClick={() => navigate("/dashboard")}>Back</Button>
              </div>
            ) :
            (
              <div className="d-flex gap-5">
                <Button size="lg" onClick={() => save("Resubmitted")}>Resubmit Assignment</Button>
                <Button size="lg" variant="secondary" onClick={() => navigate("/dashboard")}>Back</Button>
              </div>
            )
          }
          <CommentContainer assignmentId={assignmentId} />
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default AssignmentView;
