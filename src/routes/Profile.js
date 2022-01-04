import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Profile = () => {
    const history = useHistory();
    const onLogOutClick = ()=> {
        authService.signOut();
        history.push("/");
    }
    return (
        <>
        <button onClick={onLogOutClick}>Log out</button>
        <h1>Profile!!</h1>
        </>
    )
};

export default Profile;