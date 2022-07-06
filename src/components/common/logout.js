import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function Logout() {

    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();


    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
        // eslint-disable-next-line
    }, [user, loading]);

    return (
        <div className = " d-flex flex-row dashboard__container">
            <div className = "p-10"> {name} </div> 
            <button className = "button-style" onClick = {logout}>
                {t("Logout")}
            </button>
        </div>
    );
}

export default Logout;
    
    