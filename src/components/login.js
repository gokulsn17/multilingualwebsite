import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from ".././firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import Language from "./common/language";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (loading) {
        // maybe trigger a loading screen
        return;
        }
        if (user) navigate("/dashboard");
        // eslint-disable-next-line
    }, [user, loading]);

    return (
        <>
            <Language />
            <div className = "login">
                <div className = "login__container">
                    <input
                        type = "text"
                        className = "login__textBox"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        placeholder = {t("Email")}
                    />
                    <input
                        type = "Password"
                        className = "login__textBox"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder = {t("Password")}
                    />
                    <button
                        className = "login__btn"
                        onClick = {() => logInWithEmailAndPassword(email, password)}
                    >
                        {t("Login") }
                    </button>
                    <div>
                        <Link to = "/reset">
                            {t("Forgot Password")}
                        </Link>
                    </div>
                    <div>
                        {t("Don't have an account?")} 
                        <Link to = "/register">
                            {t("Register")}
                        </Link> 
                        {t("now.")}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;