import { authService } from "fbase";
import React, { useState } from "react";
import { updateProfile } from "@firebase/auth";
import { useHistory } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
        };
    };


    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} autoFocus className="formInput"/>
                <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10, }}/>
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log out</span>
        </div>
    )
};

export default Profile;