import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Language = () => {

    const { i18n } = useTranslation();
    const [lng, setLng] = useState("en");

    const changeLanguage = lng => {
        i18n.changeLanguage(lng);
        setLng(lng);
    };
  
    return (console.log(lng),
        <div className = "d-flex justify-content-end dashboard__container">
            <button 
                className = {lng === "hin" ? "button-style" :"button-selected"} 
                onClick = {() => changeLanguage("hin")}
            >
                hindi
            </button>
            <button 
                className = {lng === "en" ? "button-style" :"button-selected"} 
                onClick = {() => changeLanguage("en")}
            >
                english
            </button>
        </div>
    )
}

export default Language;