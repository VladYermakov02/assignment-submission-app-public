import React, { createContext, useContext } from 'react';
import { useLocalState } from '../util/useLocalStrage';

const UserContext = createContext();

// function userReducer(state, action) {
    // switch (action.type) {
    //   case 'logout': {
    //     return null;
    //   }
    //   case 'login': {
    //     return state;
    //   }
    //   default: {
    //     throw new Error(`Unhandled action type: ${action.type}`)
    //   }
    // }
    // return state;
//   }

// function updateUser(dispatch, user, updates) {
//     console.log("user ", user);
//     console.log("updates ", updates);
//     dispatch({type: 'anything', updates});
// }

const UserProvider = ({ children }) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    //const [state, dispatch] = useReducer(userReducer, jwt);
    const value = {jwt, setJwt};
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};

function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

// export { UserProvider, useUser,  updateUser};
export { useUser, UserProvider };