import {authService} from 'fbase';
import {
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    getAuth
} from 'firebase/auth';
import React, {useState} from "react";

const Auth = () => {
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
            let data;
            const auth = getAuth();
            if (newAccount) {
                //create account
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                //login
                data = await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
        const {target: {
                name
            }} = event;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider(authService.provider);
            const result = await signInWithPopup(authService, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
        } else if (name === "github") {
            provider = new GithubAuthProvider();
            const result = await signInWithPopup(authService, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
        }
    }
    return (
        <div>
            <h1>Auth!!</h1>
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
            <div>
                <button name="google" onClick={onSocialClick}>Continue with google</button>
                <button name="github" onClick={onSocialClick}>Continue with github</button>
            </div>
        </div>
    )
};

export default Auth;