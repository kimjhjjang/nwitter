import React, { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth
} from 'firebase/auth';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {
            target: {
                name,
                value
            }
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const auth = getAuth();
            if (newAccount) {
                //create account
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                //login
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return(
        <>
        <form onSubmit={onSubmit}>
                <input
                    onChange={onChange}
                    name="email"
                    type="text"
                    placeholder="Email"
                    required="required"
                    value={email}/>
                <input
                    onChange={onChange}
                    name="password"
                    type="passWord"
                    placeholder="password"
                    required="required"
                    value={password}/>
                <input
                    type="submit"
                    value={newAccount
                        ? "Create Acount"
                        : "Log in"}/> {error}
            </form>
            <p onClick={toggleAccount}>{
                    newAccount
                        ? "sign in"
                        : "Create Account"
                }</p>
                </>
    );
}

export default AuthForm;