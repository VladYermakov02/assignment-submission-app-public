import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStrage";
import myFetch from "../services/fetchService";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateUser, useUser } from "../userProvider";

const Login = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [jwt, setJwt] = useLocalState("", "jwt");

  // console.log(username);

  useEffect(() => {
    //if (user != null) navigate("/dashboard");
    if (user.jwt) navigate("/dashboard");
  }, [user]);

  function sendLoginRequest() {
    const reqBody = {
      username: username,
      password: password,
    };

    fetch("api/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        if (response.status === 200)
          return Promise.all([response.json(), response.headers]);
        else return Promise.reject("Invalid login attempt");
      })
      .then(([body, headers]) => {
        //setJwt(headers.get("authorization"));
        //navigate("/dashboard", {replace: true}); // {replace: true} because the app is confused what page to pick after login Dashboard or RevieverDashboard becase they both go under /dashboard link
        //window.location.href = "/dashboard";
        //setJwt(String(headers.get("authorization")));
        //updateUser(headers.get("authorization"));
        user.setJwt(headers.get("authorization"));
      })
      .catch((message) => {
        alert(message);
      });
  }

  return (
    <>
      {/* Container for CSS */}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="fs-4">Username</Form.Label>
              <Form.Control
                type="email"
                size="lg"
                placeholder="name@gmail.com"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          {/* here md (medium) means medium OR larger (screen size) */}
          <Col md="8" lg="6">
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="fs-4">Password</Form.Label>
              <Form.Control
                type="password"
                size="lg"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          {/* 'flex-md-row' chenges flex to row on medium screen */}
          <Col md="8" lg="6" className="mt-2 d-flex flex-column gap-4 flex-md-row justify-content-md-between">
            <Button
              id="submit"
              type="button"
              size="lg"
              onClick={() => sendLoginRequest()}
              variant="primary">
              Login
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => { navigate("/"); }}
              variant="secondary">
              Exit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
