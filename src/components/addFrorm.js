import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {collection, addDoc, Timestamp} from 'firebase/firestore';
import { geohashForLocation } from 'geofire-common';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

function AddForm() {

    const [user] = useAuthState(auth);
    let temp = {
        name: "",
        date : new Date(),
        lat : 0,
        lng : 0,
        userId : user?.uid,
    };
    const { t } = useTranslation();
    const [data,setData] = useState(temp);

    const onChangeHandler = (key, value) => {
        setData({
            ...data,
            [key] : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hash = geohashForLocation([Number(data.lat), Number(data.lng)]);
        try {
            let res = await addDoc(collection(db, 'task'), {
              ...data,
              created: Timestamp.fromDate(new Date(data.date)),
              geohash : hash
            })
            if(res) {
                setData(temp);
                alert("Added sucessfully")
            }
        } catch (err) {
            alert(err)
        }
    };

    return (
        <div className = "w-100 p-2  d-flex justify-content-center" >
            <form 
                className = "d-flex flex-column dashboard__container max-width-500" 
                onSubmit = {(e) => handleSubmit(e)} 
            >
                <label className = "w-100 p-2">
                    {t("Name")}
                </label>
                <input 
                    className = "w-100 p-2" 
                    type = "text" 
                    value = {data.name} 
                    onChange = {(e) => onChangeHandler("name", e.target.value)} 
                />
                <label className = "w-100 p-2">
                    {t("Date")}
                </label>
                <input
                    className = "w-100 p-2"  
                    type = "datetime-local"
                    value = {data.date} 
                    onChange = {(e) => onChangeHandler("date", e.target.value)} 
                />
                <label className = "w-100 p-2">
                    {t("Geo Location")}
                </label>
                <div className = 'd-flex '>
                    <label className = "w-25 p-2">
                        {t("Lattitude")}
                    </label>
                    <input
                        className = "w-25 p-2"  
                        type ="number"
                        value = {data.lat} 
                        min = {-90}
                        max = {90}
                        onChange = {(e) => onChangeHandler("lat", e.target.value)} 
                    />
                    <label className = "w-25 p-2">
                        {t("Longitude")}
                    </label>
                    <input
                        className = "w-25 p-2"  
                        type = "number"
                        value = {data.lng}
                        min = {-180}
                        max = {180}
                        onChange = {(e) => onChangeHandler("lng", e.target.value)} 
                    />
                </div>
                <button 
                    className = "w-100 p-2 mt-2 mb-2 button-style" 
                    type="submit" 
                >
                    {t("Add Entry")}
                </button>
            </form>
        </div>
    );
}

export default AddForm;
