import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {collection, query, orderBy, onSnapshot, deleteDoc, where, doc, startAt, endAt} from 'firebase/firestore';
import { distanceBetween, geohashQueryBounds } from 'geofire-common';


function ListData() {
    
    const [user] = useAuthState(auth);
    const { t } = useTranslation();
    const [data,setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filter,setFilter] = useState(true);
    const [geoFilter,setgeoFilter] = useState({
        lat:0,
        lng:0,
        radius:0    
    });

    useEffect(() => {
        getData();
        // eslint-disable-next-line
    },[]);

    const getData = () => {
        const q = query(collection(db, 'task'), where("userId", "==", user?.uid))
        onSnapshot(q, (querySnapshot) => {
            setData(querySnapshot.docs.map(doc => {
                return({
                    id: doc.id,
                    data: doc.data()
                })
            }));
        })
    }

    const handleDelete = async (id) => {
        const taskDocRef = doc(db, 'task', id)
        try{
            await deleteDoc(taskDocRef);
            alert("deleted entry")
        } catch (err) {
          alert(err)
        }
    }

    const searchHandler = (value) => {
        if(value){
            let temp = data;
            setFilterData(temp.filter(e => e.data.name.includes(value)));
        } else {
            setFilterData([]);
        }
    }

    const onChangeHandler = (key, value) => {
        setgeoFilter({
            ...geoFilter,
            [key] : value
        })
    }
    
    const filterGeoLocation = async () => {
        if(geoFilter.radius){
            
            let matchingDocs = [];
            const center = [Number(geoFilter.lat),Number(geoFilter.lng)];
            const radiusInM = Number(geoFilter.radius) * 1000;
            const bounds = geohashQueryBounds(center, radiusInM);
            
            for (const b of bounds) {
                const q = query(collection(db,'task'),orderBy('geohash',"asc"),startAt(b[0]),endAt(b[1]))
                onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docs.forEach(e => {
                        const lat =Number(e.data().lat) ;
                        const lng = Number(e.data().lng) ;
                        const distanceInKm = distanceBetween([lat, lng], center);
                        const distanceInM = distanceInKm * 1000;
                        if (distanceInM <= radiusInM) {
                            matchingDocs.push({id : e.id, data: e.data()});
                            console.log(matchingDocs)
                            setFilterData([...matchingDocs])
                        }
                    })
                })
            }
            setFilter(false);
        } else {
            setFilter(true);
        }
    }
    return (
        <div className = "w-100 p-2 d-flex justify-content-center flex-column" >
            <div className = 'd-flex justify-content-between mt-3 mb-3'>
                <div>
                    <input 
                        type = "text" 
                        value = {searchText} 
                        onChange = {(e) => {
                            if(e.target.value === ""){
                                setFilterData([]);
                            }
                            setSearchText(e.target.value);
                        }} 
                    />
                    <button 
                        className = 'button-style' 
                        onClick = {() => searchHandler(searchText)} 
                    >
                        {t("Search")}
                    </button>
                </div>
                <div>
                    <div className = 'd-flex '>
                        <label className = "p-2">
                            {t("Lattitude")}
                        </label>
                        <input
                            className = "p-2"  
                            type = "number"
                            value = {geoFilter.lat} 
                            min = {-90}
                            max = {90}
                            onChange = {(e) => onChangeHandler("lat", e.target.value)} 
                        />
                        <label className = "p-2">
                            {t("Longitude")}
                        </label>
                        <input
                            className = "p-2"  
                            type = "number"
                            value = {geoFilter.lng}
                            min = {-180}
                            max = {180}
                            onChange = {(e) => onChangeHandler("lng", e.target.value)} 
                        />
                        <label className = " p-2">
                            {t("Radius")}
                        </label>
                        <input
                            className = "p-2"  
                            type = "number"
                            value = {geoFilter.radius}
                            onChange = {(e) => onChangeHandler("radius", e.target.value)} 
                        />
                        <button 
                            className = 'button-style'
                            onClick = {filter 
                                ? () => filterGeoLocation()
                                : () => {
                                    setFilter(true)
                                    setgeoFilter({lat:0, lng:0, radius:0})
                                    setFilterData([]);
                                }
                            }
                        >
                            {filter ? t("Filter") : t("Reset")}
                        </button>
                    </div>
                </div>
            </div>
            <table className = 'dashboard__container'>
                <tr>
                    <th className = "p-2" > {t("Id")}</th>
                    <th className = "p-2"> {t("Name")} </th>
                    <th className = "p-2"> {t("Geo Location")} </th>
                    <th className = "p-2"> {t("Timestamp")} </th>
                    <th className = "p-2"> {t("Delete")} </th>
                </tr>
                {(filterData.length ? filterData : data)?.map((e,i) => {
                    return(
                        <tr key = {i}className = "p-2" >
                            <td className = "p-2">{e.id}</td>
                            <td className = "p-2">{e.data.name}</td>
                            <td className = "p-2">{`Lat ${e.data.lat} Lng ${e.data.lng}`}</td>
                            <td className = "p-2">{e.data.created.toDate().toString()}</td>
                            <td className = "p-2">
                                <button className = 'button-style' onClick = {() => handleDelete(e.id)}>
                                    {t("Delete")}
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
}

export default ListData;
