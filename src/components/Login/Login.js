import React, { useContext, useState } from 'react';
import { createUserWithEmailAndPassword, handleSignInWithGithub, handleSignInWithGoogle, signInWithEmailAndPassword } from './loginManager';
import './Login.css';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-solid-svg-icons'




const Login = () => {
    const [newUser, setNewUser] = useState(false)
    const [user, setUser] = useState({});
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const googleSignIn = () => {
        handleSignInWithGoogle()
            .then(res => {
              handleResponse(res);
            })
    }

    const ghSignIn = () => {
        handleSignInWithGithub()
            .then(res => {
                handleResponse(res);
            })
    }

    const handleOnBlur = (e) => {
        let isFieldValid = true;
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === 'password') {
            const isPasswordLength = e.target.value.length > 6;
            const isPasswordHasNumber = /\d{1}/.test(e.target.value);
            isFieldValid = isPasswordLength && isPasswordHasNumber;
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
            console.log(isFieldValid)
        }

    }

    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    handleResponse(res);
                })
        }
        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res);
                })
        }
        e.preventDefault();
    }

    const handleResponse = (res) => {
        setUser(res);
        setLoggedInUser(res);
        history.replace(from);
    }



    return (
        <div>
            <div className="loginbox">
                <h1>Login Here</h1>
                <form onSubmit={handleSubmit}>
                    {newUser && <input type="text" name="name" onBlur={handleOnBlur} placeholder="Your name" />}
                    <br />
                    <input type="email" name="email" onBlur={handleOnBlur} placeholder="Your email" />
                    <br />
                    <input type="password" name="password" onBlur={handleOnBlur} placeholder="Your password" />
                    <br />
                    <input type="submit" value={newUser ? "Sign up" : "Sign in"} />
                    <a href="#">Forgot Password?</a>
                    <br />
                    <a href="#" onClick={() => setNewUser(!newUser)}>Don't have an account? Create one.</a>
                    <br />
                    <p>or Login with</p>
                    <br />
                </form>
                <div>
                    <button onClick={googleSignIn} className="signin-btn">G</button>
                    <FacebookIcon onClick='' className="signin-btn"></FacebookIcon>
                    <GitHubIcon onClick={ghSignIn} className="signin-btn"></GitHubIcon>
                    
                </div>
            </div>
        </div>
    );
}

export default Login;