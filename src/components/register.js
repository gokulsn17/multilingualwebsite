import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate,  } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword
} from ".././firebase";
import { useTranslation } from "react-i18next";
import Language from "./common/language";

function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const register = () => {
        if (!name) alert("Please enter name");
        registerWithEmailAndPassword(name, email, password);
    };

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/dashboard");
        // eslint-disable-next-line
    }, [user, loading]);

    return (
        <>
            <Language />
            <div className = "register">
                <div className = "register__container">
                    <input
                        type = "text"
                        className = "register__textBox"
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                        placeholder = {t("Name")}
                    />
                    <input
                        type = "text"
                        className = "register__textBox"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        placeholder = {t("Email")}
                    />
                    <input
                        type = "password"
                        className = "register__textBox"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder = {t("Password")}
                    />
                    <button className = "register__btn" onClick = {register}>
                        {t("Register")}
                    </button>
                    <div>
                        {t("Already have an account?")}
                        <Link to = "/">
                            {t("Login")}
                        </Link> 
                        {t("now.")}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;