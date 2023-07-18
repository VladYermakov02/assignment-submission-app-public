import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myFetch from "../services/fetchService";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import StatusBadge from "../statusBadge";
import { useUser } from "../userProvider";

const CodeReviewerDashboard = () => {
  const navigate = useNavigate();
  // params are getter and setter to json web token
  // keeps value of jwt in local browser storage
  //const [jwt, setJwt] = useLocalState("", "jwt");
  const user = useUser();
  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    //console.log("useEffect is called in codeReviewDashboard");
    if (!user.jwt) navigate("/login");
  });

  function editReview(assignment) {
    //window.location.href = `/assignments/${assignment.id}`;
    navigate(`/assignments/${assignment.id}`);
  }

  function claimAssignment(assignment) {
    // console.log(user);
    const decodedJwt = jwt_decode(user.jwt);
    // console.log(user);
    // sub means username (reserved word)
    const currUser = {
      username: decodedJwt.sub,
    };
    assignment.codeReviewer = currUser;
    // TODO: remove hardcode
    assignment.status = "In Review";

    myFetch(`/api/assignments/${assignment.id}`, "PUT", user.jwt, assignment)
      .then((updatedAssignment) => {
        // updates the view
        const assignmentsCopy = [...assignments]; // '...' means copy
        const i = assignmentsCopy.findIndex((a) => a.id === assignment.id); // finds needed assignment
        assignmentsCopy[i] = updatedAssignment;
        setAssignments(assignmentsCopy);
      });
  }

  useEffect(() => {
    myFetch(`/api/assignments`, "GET", user.jwt)
      .then((assignmentsData) => {
        setAssignments(assignmentsData); // triggers return here
        //console.log(assignmentsData);
      });
  }, [user.jwt]); // empty '[]' means once per page load

  // 'assignments' the proper syntax is in plural
  // function createAssignment() {
  //   myFetch(`/api/assignments`, "POST", jwt)
  //     .then((assignment) => {
  //       window.location.href = `/assignments/${assignment.id}`;
  //       // console.log(assignment);
  //     });
  // }

  return (
    <Container>
      <Row>
        <Col>
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
            onClick={() => {
              user.setJwt(null);
              //navigate("/login");
            }}
          >
            Logout
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="h1">Code Reviewer Dashboard</div>
        </Col>
      </Row>
      <div className="assignment-wrapper in-review">
        <div className="assignment-wrapper-title h3 px-2">In Review</div>
        {/* TODO: Replace copy-pasting with a component */}
        {assignments && assignments.filter((assignment) => assignment.status === "In Review").length > 0 ? (
          // <Row>
          <div className="d-grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}>
            {assignments.filter((assignment) => assignment.status === "In Review").map((assignment) => (
              // <Col>
              <Card key={assignment.id} style={{ width: '18rem', height: '18rem' }}>
                <Card.Body className="d-flex flex-column justify-content-around">
                  <Card.Title>Assignment #{assignment.number}</Card.Title>
                  <div className="d-flex align-items-start">
                    <StatusBadge text={assignment.status} />
                  </div>
                  <Card.Text style={{ marginTop: "1em" }}>
                    <p><b>Github Url</b>: {assignment.githubUrl}</p>
                    <p><b>Branch</b>: {assignment.branch}</p>
                  </Card.Text>
                  <Button variant="secondary" onClick={() => {
                    editReview(assignment);
                  }}>Edit</Button>
                </Card.Body>
              </Card>
              // </Col>
            ))}
          </div>
          // </Row>
        ) : (
          <div>No assignments found</div>
        )
        }
      </div>

      <div className="assignment-wrapper submitted">
        {/* 'px' is padding */}
        <div className="assignment-wrapper-title h3 px-2">Awaiting review</div>
        {/* do we have data for the assignments? if yes - use map (so we tranform data into jsx elements) to display data on the screen*/}
        {assignments && assignments.filter((assignment) => assignment.status === "Submitted" || assignment.status === "Resubmitted").length > 0 ? (
          // <Row>
          <div className="d-grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}>
            {assignments.filter((assignment) => assignment.status === "Submitted" || assignment.status === "Resubmitted")
              .sort((a, b) => {
                if (a.status === "Resubmitted") return -1;
                else return 1;
              })
              .map((assignment) => (
                // <Col>
                <Card key={assignment.id} style={{ width: '18rem', height: '18rem' }}>
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex align-items-start">
                      <StatusBadge text={assignment.status} />
                    </div>
                    <Card.Text style={{ marginTop: "1em" }}>
                      <p><b>Github Url</b>: {assignment.githubUrl}</p>
                      <p><b>Branch</b>: {assignment.branch}</p>
                    </Card.Text>
                    <Button variant="secondary" onClick={() => {
                      claimAssignment(assignment);
                    }}>Claim</Button>
                  </Card.Body>
                </Card>
                // </Col>
              ))}
          </div>
          // </Row>
        ) : (
          <div>No assignments found</div>
        )}
      </div>

      <div className="assignment-wrapper needs-update">
        <div className="assignment-wrapper-title h3 px-2">Needs Update</div>
        {/* TODO: Replace copy-pasting with a component */}
        {assignments && assignments.filter((assignment) => assignment.status === "Needs Update").length > 0 ? (
          // <Row>
          <div className="d-grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}>
            {assignments.filter((assignment) => assignment.status === "Needs Update").map((assignment) => (
              // <Col>
              <Card key={assignment.id} style={{ width: '18rem', height: '18rem' }}>
                <Card.Body className="d-flex flex-column justify-content-around">
                  <Card.Title>Assignment #{assignment.number}</Card.Title>
                  <div className="d-flex align-items-start">
                    <StatusBadge text={assignment.status} />
                  </div>
                  <Card.Text style={{ marginTop: "1em" }}>
                    <p><b>Github Url</b>: {assignment.githubUrl}</p>
                    <p><b>Branch</b>: {assignment.branch}</p>
                  </Card.Text>
                  <Button variant="secondary" onClick={() => {
                    //window.location.href = `/assignments/${assignment.id}`;
                    navigate(`/assignments/${assignment.id}`);
                  }}>View</Button>
                </Card.Body>
              </Card>
              // </Col>
            ))}
          </div>
          // </Row>
        ) : (
          <div>No assignments found</div>
        )
        }
      </div>

    </Container>
  );
};

export default CodeReviewerDashboard;
