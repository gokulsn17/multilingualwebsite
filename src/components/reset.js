import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import Language from "./common/language";

function Reset() {

    const [email, setEmail] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/dashboard");
        // eslint-disable-next-line
    }, [user, loading]);

    return (
        <>
            <Language />
            <div className = "reset">
                <div className = "reset__container">
                    <input
                        type = "text"
                        className = "reset__textBox"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        placeholder = {t("Email")}
                    />
                    <button
                        className = "reset__btn"
                        onClick = {() => sendPasswordReset(email)} 
                    >
                        {t("Send password reset email")}
                    </button>
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

export default Reset;