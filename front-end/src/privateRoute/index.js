import React, { useState } from 'react';
import { useUser } from '../userProvider';
import { Navigate } from 'react-router-dom';
import myFetch from '../services/fetchService';

const PrivateRoute = (props) => {
    //const [jwt, setJwt] = useLocalState("", "jwt");
    const user = useUser();
    const [isLoading, setIsLoading] = useState(true); // true because when we get here the page is loading and awaits the answer
    const [isValid, setIsValid] = useState(null); // null because we're not sure about the data by this point
    const { children } = props;

    if (user) {
        // isValid is send from back-end
        myFetch(`/api/auth/validate?token=${user.jwt}`, "GET", user.jwt)
            .then((isValid) => {
                setIsValid(isValid);
                setIsLoading(false);
            });
    }
    else {
        return <Navigate to="/login" />;
    }

    return isLoading ? <div>Loading...</div> : isValid === true ? children : <Navigate to="/login" />;
};

export default PrivateRoute;