import { useEffect, useState } from "react";
import "./App.css";
import jwt_decode from "jwt-decode";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import CodeReviewerDashboard from "./codeReviewerDashboard";
import CodeReviewerAssignmentView from "./codeReviewAssignmentView";
import Homepage from "./homepage";
import Login from "./login";
import PrivateRoute from "./privateRoute";
import AssignmentView from "./assignmentView";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from "./userProvider";

function App() {
  // params are getter and setter to json web token
  // keeps value of jwt in local browser storage
  //const [jwt, setJwt] = useLocalState("", "jwt");
  //const [roles, setRoles] = useState(getRolesFromJWT());
  const [roles, setRoles] = useState([]);

  const user = useUser();

  useEffect(() => {
    //console.log("useEffect is called");
    //console.log("JWT has changed");
    setRoles(getRolesFromJWT());
  }, [user.jwt]);

  function getRolesFromJWT() {
    try {
      if (user.jwt) {
        const decodedJwt = jwt_decode(user.jwt);
        //console.log("decoded JWT:", decodedJwt);
        return decodedJwt.authorities;
      }
    } catch (error) {
      if (error.message === "Invalid token specified") {
        console.log('Invalid token');
      } else {
        console.log('Error decoding token:', error.message);
      }
      return [];
    }
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          roles?.find((role) => role === "ROLE_CODE_REVIEWER") ?
            (<PrivateRoute><CodeReviewerDashboard /></PrivateRoute>) :
            (<PrivateRoute><Dashboard /></PrivateRoute>)
        }
      />
      <Route
        // path="/assignments/:id"
        path="/assignments/:assignmentId"
        element={
          roles?.find((role) => role === "ROLE_CODE_REVIEWER") ?
            (<PrivateRoute><CodeReviewerAssignmentView /></PrivateRoute>) :
            (<PrivateRoute><AssignmentView /></PrivateRoute>)
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

export default App;

/*
// the new method
let routes = useRoutes([
    { path: "/", element: <Homepage /> },
    {
      path: "/dashboard",
      element:
        roles?.find((role) => role === "ROLE_CODE_REVIEWER") ?
          (<PrivateRoute><CodeReviewerDashboard /></PrivateRoute>) :
          (<PrivateRoute><Dashboard /></PrivateRoute>),
    },
    { path: "/login", element: <Login /> },
    {
      path: "/assignments/:id",
      element:
        roles?.find((role) => role === "ROLE_CODE_REVIEWER") ?
          (<PrivateRoute><CodeReviewerAssignmentView /></PrivateRoute>) :
          (<PrivateRoute><AssignmentView /></PrivateRoute>),
    },
  ]);
  // <PrivateRoute handleJwt={setJwt}
  // return <UserProvider>routes</UserProvider>;
  return routes;
*/

/*
// this method was deprecated
return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ?
            (<PrivateRoute><CodeReviewerDashboard /></PrivateRoute>) :
            (<PrivateRoute><Dashboard /></PrivateRoute>)
        }
      />
      <Route
        path="/assignments/:id"
        element={
          roles.find((role) => role === "ROLE_CODE_REVIEWER") ? 
          (<PrivateRoute><CodeReviewerAssignmentView /></PrivateRoute>) :
          (<PrivateRoute><AssignmentView /></PrivateRoute>)
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
*/