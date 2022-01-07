import AuthForm from 'component/AuthForm';
import {authService} from 'fbase';
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

const Auth = () => {

    const onSocialClick = async (event) => {
        const {target: {
                name
            }} = event;
        let provider;
        if (name === "google") {
            provider = new GoogleAuthProvider(authService.provider);
            const result = await signInWithPopup(authService, provider);
            GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
        } else if (name === "github") {
            provider = new GithubAuthProvider();
            const result = await signInWithPopup(authService, provider);
            GithubAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
        }
    }
    return (
        <div>
            <h1>Auth!!</h1>
            <AuthForm />
            <div>
                <button name="google" onClick={onSocialClick}>Continue with google</button>
                <button name="github" onClick={onSocialClick}>Continue with github</button>
            </div>
        </div>
    )
};

export default Auth;