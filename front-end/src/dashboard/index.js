import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myFetch from "../services/fetchService";
import { Button, Card, Col, Row } from "react-bootstrap";
import StatusBadge from "../statusBadge";
import { useUser } from "../userProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  // params are getter and setter to json web token
  // keeps value of jwt in local browser storage
  //const [jwt, setJwt] = useLocalState("", "jwt");
  const user = useUser();
  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    myFetch(`/api/assignments`, "GET", user.jwt)
      .then((assignmentsData) => {
        setAssignments(assignmentsData); // triggers return here
      });
      if (!user.jwt) navigate("/login");
  }, [user.jwt]); // empty '[]' means once per page load

  // 'assignments' the proper syntax is in plural
  function createAssignment() {
    myFetch(`/api/assignments`, "POST", user.jwt)
      .then((assignment) => {
        //window.location.href = `/assignments/${assignment.id}`;
        navigate(`/assignments/${assignment.id}`);
        // console.log(assignment);
      });
  }

  return (
    <div style={{ margin: "2em" }}>
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
      <div className="mb-5">
        <Button size="lg" onClick={() => createAssignment()}>Submit New Assignment</Button>
      </div>
      {/* do we have data for the assignments? if yes - use map (so we tranform data into jsx elements) to display data on the screen*/}
      {assignments ? (
        // <Row>
        <div className="d-grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, 18rem)" }}>
          {assignments.map((assignment) => (
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
                  navigate(`/assignments/${assignment.id}`) 
                }}>Edit</Button>
              </Card.Body>
            </Card>
            // </Col>
          ))}
        </div>
        // </Row>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
