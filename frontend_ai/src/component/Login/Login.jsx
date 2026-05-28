import React, { useState } from "react";
import styles from "./Login.module.css";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";
import { constant } from "firebase/firestore/pipelines";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const Login = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserInfo } = useContext(AuthContext);

    const handlelogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user.photoURL);
            const userData = {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            }

            await axios.post('/api/user', userData).then((response) => {
                setUserInfo(response.data.user);
                setIsAuthenticated(true);

                // Store user info in localStorage
                localStorage.setItem("userInfo", JSON.stringify(response.data.user));
                localStorage.setItem("islogin", true);
                console.log(response.data);
                navigate('/dashboard');
            })
                .catch(err => {
                    console.log(err);
                    alert("Login failed. Please try again.");
                })

        }
        catch (err) {
            alert("Login failed. Please try again.");
            console.log(err);
        }

    }
    return (
        <div className={styles.Login}>
            <div className={styles.loginCard}>
                <div className={styles.loginCardTitle}>
                    <h1>Login</h1>
                    <VpnKeyIcon />
                </div>

                <div className={styles.googlebtn} onClick={handlelogin}>
                    <GoogleIcon sx={{ fontSize: "20px", color: "red" }} /> Sign in with Google
                </div>
            </div>
        </div>
    )
}

export default Login

